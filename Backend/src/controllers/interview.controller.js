import { InterviewReport } from "../models/interviewReport.models.js";
import {
    generateInterviewReport,
    interviewReportZodSchema,
} from "../services/ai.service.js";
// import { generateInterviewReportMis } from "../services/mistralai.ai.js"
import { createRequire } from "module";
import mongoose from "mongoose";
import { History } from "../models/history.models.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");


export const sanitizeAiResponse = (data) => {
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch {
            return data;
        }
    }

    if (Array.isArray(data)) {
        return data
            .filter(
                (item) =>
                    item !== "{" &&
                    item !== "}" &&
                    item !== ":"
            )
            .map(sanitizeAiResponse);
    }

    if (data === null || typeof data !== "object") {
        return data;
    }

    const result = {};

    for (const [key, value] of Object.entries(data)) {
        result[key] = sanitizeAiResponse(value);
    }

    return result;
};


export const generateInterViewReportController = async (req, res) => {
    try {
        const userId = req.user?._id || req.userId;

        const { resume, selfdescribe, jobdescribe } = req.body;
        if (!resume || !selfdescribe || !jobdescribe) {
            return res.status(400).json({
                message: "Resume, self-description, and job description are required"
            });
        }

        // ✅ 1. Generate AI report
        const report = await generateInterviewReport({
            resume,
            selfdescribe,
            jobdescribe,
        });

        if (!report || typeof report !== "object") {
            console.error("AI service returned an invalid report:", report);

            return res.status(502).json({
                message: "AI service returned an invalid report",
            });
        }

        const sanitizedReport = sanitizeAiResponse(report);

        const validation =
            interviewReportZodSchema.safeParse(sanitizedReport);

        if (!validation.success) {
            console.error(
                "Controller report validation failed:",
                JSON.stringify(validation.error.issues, null, 2)
            );

            return res.status(502).json({
                message: "AI report structure is invalid",
                issues: validation.error.issues,
            });
        }

        const validReport = validation.data;

        // ✅ 2. Save Report to DB
        const interviewReport = await InterviewReport.create({
            user: userId,
            resumeText: resume,
            selfDescription: selfdescribe,
            jobDescription: jobdescribe,
            ...validReport,
        });

        if (!interviewReport) {
            return res.status(500).json({ message: "Failed to save interview report" });
        }

        // ✅ 3. Auto-generate title for this specific submission
        const autoHistoryTitle = jobdescribe
            ? `Report: ${jobdescribe.trim().slice(0, 30)}...`
            : `Interview Analysis - ${new Date().toLocaleDateString()}`;

        // ✅ 4. Create a NEW History document for this submission
        const newHistory = await History.create({
            userId: userId,
            historyTitle: autoHistoryTitle,
            analysisIds: [interviewReport._id]
        });

        // ✅ 5. Response
        return res.status(201).json({
            message: "Interview report generated successfully",
            history: newHistory,
            interviewReport
        });

    } catch (error) {
        console.error("Controller Error:", error);
        if (error.code === "INVALID_INTERVIEW_INPUT") {
            return res.status(400).json({
                message: error.message
            });
        }
        return res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message
        });
    }
};

/**
 * @desc    Fetch a single InterviewReport directly by report ID
 * @route   GET /api/v1/reports/:reportId
 * @access  Private
 */
export const getReportById = async (req, res) => {
    try {
        const { reportId } = req.params;
        const userId = req.userId;

        const report = await InterviewReport.findOne({ _id: reportId, user: userId });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found or unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch report",
            error: error.message,
        });
    }
};


// export const generateInterViewReportController2 = async (req, res) => {
//   try {
//     const userId = req.user?._id || req.userId;

//     // 1. Validate Input
//     const { resume, selfdescribe, jobdescribe } = req.body;
//     if (!resume || !selfdescribe || !jobdescribe) {
//       return res.status(400).json({
//         message: "Resume, self-description, and job description are required",
//       });
//     }

//     // 2. Generate AI Report
//     const report = await generateInterviewReportMis({
//       resume,
//       selfdescribe,
//       jobdescribe,
//     });

//     const sanitizedReport = sanitizeAiResponse(report);

//     if (!sanitizedReport) {
//       return res.status(500).json({
//         message: "Failed to generate interview report from AI service",
//       });
//     }

//     // 3. Save Report to DB
//     const interviewReport = await InterviewReport.create({
//       user: userId,
//       resumeText: resume,
//       selfDescription: selfdescribe,
//       jobDescription: jobdescribe,
//       ...sanitizedReport,
//     });

//     // 4. Generate Clean Title
//     const trimmedJob = jobdescribe.trim();
//     const autoHistoryTitle =
//       trimmedJob.length > 30
//         ? `Report: ${trimmedJob.slice(0, 30)}...`
//         : `Report: ${trimmedJob}` || `Interview Analysis - ${new Date().toLocaleDateString()}`;

//     // 5. Create History Document
//     let newHistory;
//     try {
//       newHistory = await History.create({
//         userId: userId,
//         historyTitle: autoHistoryTitle,
//         analysisIds: [interviewReport._id],
//       });
//     } catch (historyError) {
//       // Rollback: delete orphaned report if history creation fails
//       await InterviewReport.findByIdAndDelete(interviewReport._id);
//       throw historyError;
//     }

//     // 6. Return Response
//     return res.status(201).json({
//       message: "Interview report generated successfully",
//       history: newHistory,
//       interviewReport,
//     });
//   } catch (error) {
//     console.error("Controller Error:", error);

//     return res.status(500).json({
//       message: "Failed to generate interview report",
//       error: error.message,
//     });
//   }
// };