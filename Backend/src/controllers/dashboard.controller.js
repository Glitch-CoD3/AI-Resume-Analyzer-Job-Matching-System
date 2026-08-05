import { History } from "../models/history.models.js";
import { InterviewReport } from "../models/interviewReport.models.js";
import { User } from "../models/user.models.js";
import { Session } from "../models/session.models.js";
import mongoose from 'mongoose';
import { uploadAvatarToCloudinary, deleteAvatarFromCloudinary } from "../utils/cloudinary.js";

/**
 * @desc    Get user history log with populated report details
 * @route   GET /api/v1/dashboard/history
 * @access  Private
 */
export const getUserHistory = async (req, res) => {
  try {
    const userId = req.userId;

    // Find user's history and populate linked reports with explicit model name
    const history = await History.find({ userId })
      .populate({
        path: "analysisIds",
        model: "InterviewReport", // 👈 Explicitly specify model name
        select: "jobDescription overallScore matchScore atsScore createdAt",
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 });

    if (!history || history.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No history found for this user",
        data: {
          history: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "User history fetched successfully",
      count: history.length,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user history",
      error: error.message,
    });
  }
};


/**
 * @desc    Get dashboard metrics, score trends, and user details
 * @route   GET /api/v1/dashboard/analytics
 * @access  Private
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [user, scoreStats, rawTrends, topSkillGaps, recentAnalyses] =
      await Promise.all([
        User.findById(userId).select("-password"),

        InterviewReport.aggregate([
          { $match: { user: userObjectId } },
          {
            $group: {
              _id: null,
              totalReports: { $sum: 1 },
              avgOverallScore: { $avg: "$overallScore" },
              avgMatchScore: { $avg: "$matchScore" },
              avgAtsScore: { $avg: "$atsScore" },
            },
          },
        ]),

        InterviewReport.find({ user: userId })
          .select("overallScore matchScore atsScore createdAt")
          .sort({ createdAt: 1 })
          .lean(),

        InterviewReport.aggregate([
          { $match: { user: userObjectId } },
          { $unwind: "$skillGaps" },
          {
            $group: {
              _id: "$skillGaps.skill",
              severity: { $first: "$skillGaps.severity" },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),

        InterviewReport.find({ user: userId })
          .select("jobDescription overallScore matchScore atsScore createdAt")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    const scoreTrends = rawTrends.map((trend) => ({
      _id: trend._id,
      overallScore: trend.overallScore ?? 0,
      matchScore: trend.matchScore ?? 0,
      atsScore: trend.atsScore ?? 0,
      createdAt: trend.createdAt,
    }));

    const metrics = scoreStats[0] || {
      totalReports: 0,
      avgOverallScore: 0,
      avgMatchScore: 0,
      avgAtsScore: 0,
    };

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        user,
        summary: {
          totalAnalyses: metrics.totalReports,
          avgOverallScore: Math.round(metrics.avgOverallScore || 0),
          avgMatchScore: Math.round(metrics.avgMatchScore || 0),
          avgAtsScore: Math.round(metrics.avgAtsScore || 0),
        },
        scoreTrends,
        topSkillGaps,
        recentAnalyses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics",
      error: error.message,
    });
  }
};

/**
 * @desc    Get detailed user profile, active sessions, and paginated reports
 * @route   GET /api/v1/dashboard/details
 * @access  Private
 */
export const getDashboardDetails = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [user, activeSessions, reports, totalReports] = await Promise.all([
      User.findById(userId).select("-password"),

      Session.find({ user: userId, revoked: false })
        .select("ip userAgent createdAt updatedAt")
        .sort({ updatedAt: -1 }),

      InterviewReport.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      InterviewReport.countDocuments({ user: userId }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard details fetched successfully",
      data: {
        user,
        activeSessions,
        reports: {
          docs: reports,
          pagination: {
            totalDocs: totalReports,
            page,
            limit,
            totalPages: Math.ceil(totalReports / limit),
          },
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard details",
      error: error.message,
    });
  }
};


/**
 * @desc    Update user avatar
 * @route   PUT /api/v1/dashboard/avatar
 * @access  Private
 */
export const updateUserAvatar = async (req, res) => {
  try {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      return res.status(400).json({
        success: false,
        message: "No avatar file provided",
      });
    }

    // Get current user
    const existingUser = await User.findById(req.userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Upload new avatar
    const uploadedAvatar = await uploadAvatarToCloudinary(avatarLocalPath);

    if (!uploadedAvatar?.url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload avatar",
      });
    }

    // Delete old avatar (if exists)
    if (existingUser.avatar) {
      await deleteAvatarFromCloudinary(existingUser.avatar);
    }

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $set: {
          avatar: uploadedAvatar.url,
        },
      },
      { returnDocument: "after" }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update avatar",
      error: error.message,
    });
  }
};