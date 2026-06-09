import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const interviewReportZodSchema = z.object({
  summary: z.string(),

  strengths: z.array(z.string()),
  resumeIssues: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),

  keywordAnalysis: z.object({
    matchedKeywords: z.array(z.string()),
    missingKeywords: z.array(z.string()),
    keywordMatchPercentage: z.number().min(0).max(100),
  }),

  resumeRewrite: z.object({
    before: z.string(),
    after: z.string(),
  }),

  learningRoadmap: z.array(
    z.object({
      skill: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      reason: z.string(),
      resources: z.array(z.string()),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      task: z.string(),
    })
  ),

  overallScore: z.number().min(0).max(100),
  matchScore: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
});



export async function generateInterviewReport({ resume, selfdescribe, jobdescribe }) {
  const prompt = `
Act as a Senior Technical Interviewer. Analyze the provided data to generate a comprehensive Career Report in JSON format.

🎯 ANALYSIS CRITERIA:
1. summary: Professional 3-line evaluation.
2. keywordAnalysis: Compare Resume vs Job Description for ATS optimization.
3. resumeIssues: at least 3 strings describing specific weaknesses in the resume.
4. improvementSuggestions: at least 3 actionable recommendations to enhance the resume and interview performance.,
5. resumeRewrite: Transform a weak resume line into a high-impact, results-driven statement.
6. roadmap/gaps: Identify critical missing skills (High/Med/Low) with study resources.
7. Q&A: 5+ Technical (depth-focused) and 3+ Behavioral (STAR method) questions.
8. prepPlan: A realistic 5-day step-by-step action plan.
9. Overall Scoring : provide overall score with short justifications.
10. Match Scoring: Evaluate how well the candidate's profile matches the job requirements.
11. ATS Scoring: Assess the resume's effectiveness in passing Applicant Tracking Systems.


⚠️ OUTPUT CONSTRAINTS:
- Return ONLY valid JSON matching the provided schema.
- No markdown (\`\`\`), no preamble, no trailing text.
- Maintain data type integrity (Strings, Numbers, Arrays).
- Use professional industry terminology.

📥 INPUTS:
Job: ${jobdescribe}
Resume: ${resume}
Self-Bio: ${selfdescribe}
`;

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportZodSchema),
      }
    })

    // Double check if text exists before parsing
    if (response) {

      return JSON.parse(response.text);

    } else {
      console.warn("AI response is empty");
      return null;
    }


  } catch (error) {
    // ✅ Print the error to console instead of crashing the server
    console.error("--- AI SERVICE ERROR ---");
    console.error("Message:", error.message);

    // Check for specific API availability issues (503)
    if (error.message.includes("503") || error.message.includes("high demand")) {
      console.warn("Server busy: High demand spike.");
    }

    // Return null so your controller knows it failed without the app dying
    return null;
  }
}