import { History } from "../models/history.models.js";

/**
 * @desc    Get all history items (sidebar list) for logged-in user
 * @route   GET /api/v1/history
 * @access  Private
 */
export const getAllUserHistories = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;

    // Fetch all history entries created by this user
    const histories = await History.find({ userId })
      .select("historyTitle createdAt analysisIds")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User histories fetched successfully",
      count: histories.length,
      data: histories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user histories",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single history item with full populated report
 * @route   GET /api/v1/history/:historyId
 * @access  Private
 */
export const getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const historyItem = await History.findOne({
      _id: id,
      userId,
    }).populate({
      path: "analysisIds",
      model: "InterviewReport",
    });

    if (!historyItem) {
      return res.status(404).json({
        success: false,
        message: "History entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "History report retrieved successfully",
      data: {
        historyId: historyItem._id,
        historyTitle: historyItem.historyTitle,
        createdAt: historyItem.createdAt,
        reports: historyItem.analysisIds,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve history report",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a specific history entry
 * @route   DELETE /api/v1/history/:historyId
 * @access  Private
 */
export const deleteHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const deletedHistory = await History.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedHistory) {
      return res.status(404).json({
        success: false,
        message: "History entry not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "History entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete history item",
      error: error.message,
    });
  }
};