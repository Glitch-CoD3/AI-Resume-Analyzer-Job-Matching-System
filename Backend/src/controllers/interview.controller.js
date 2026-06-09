import { InterviewReport } from "../models/interviewReport.models.js";
import { generateInterviewReport } from "../services/ai.service.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");


export const sanitizeAiResponse = (data) => {
    // If the AI sent a string, parse it
    let obj = typeof data === 'string' ? JSON.parse(data) : data;

    // Helper to remove standalone "{" or "}" strings from arrays
    const cleanArray = (arr) => {
        if (!Array.isArray(arr)) return arr;
        return arr
            .filter(item => item !== '{' && item !== '}' && item !== ':')
            .map(item => (typeof item === 'object' ? sanitizeAiResponse(item) : item));
    };

    // Recursively clean all fields
    for (let key in obj) {
        if (Array.isArray(obj[key])) {
            obj[key] = cleanArray(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            obj[key] = sanitizeAiResponse(obj[key]);
        }
    }
    return obj;
};

export const generateInterViewReportController = async (req, res) => {
    try {
        // ✅ 1. Validate input
        // if (!req.file) {
        //     return res.status(400).json({ message: "Resume PDF is required" });
        // }


        // const { selfDescription, jobDescription } = req.body;

        // if (!selfDescription || !jobDescription) {
        //     return res.status(400).json({
        //         message: "selfDescription and jobDescription are required"
        //     });
        // }

        // // ✅ 2. Parse PDF
        // const pdfData = await pdfParse(req.file.buffer);
        // const resumeText = JSON.stringify(
        //     pdfData.text
        //         .replace(/\s+/g, " ")
        //         .trim()
        // );



        // if (!resumeText) {
        //     throw new Error("Failed to extract text from PDF");
        // }

        // console.log(resumeText);

       const { resume, selfdescribe, jobdescribe } = req.body;
            if (!resume || !selfdescribe || !jobdescribe) { 
                return res.status(400).json({ message: "Resume, self-description, and job description are required" });
            }

        // ✅ 3. Generate AI report
        const report = await generateInterviewReport({
            resume: resume,
            selfdescribe: selfdescribe,
            jobdescribe: jobdescribe
        });

        // Sanitize the AI response
        const sanitizedReport = sanitizeAiResponse(report);

        if (!sanitizedReport) {
            return res.status(500).json({ message: "Failed to generate interview report" });
        }
        // ✅ 4. Save to DB
        const interviewReport = await InterviewReport.create({
            user: req.userId,
            resumeText: resume,
            selfDescription: selfdescribe,
            jobDescription: jobdescribe,
            ...sanitizedReport
        });
        

        if(!interviewReport) {
            return res.status(500).json({ message: "Failed to save interview report" });
        }

        // ✅ 5. Response
        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Controller Error:", error.message);

        return res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message
        });
    }
};