import { ChatMistralAI } from "@langchain/mistralai";
import { z } from "zod";

const interviewReportZodSchema = z.object({
  summary: z.string().describe("Professional 3-line evaluation"),

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

export async function generateInterviewReportMis({ resume, selfdescribe, jobdescribe }) {
  // Initialize the ChatMistralAI model
  const model = new ChatMistralAI({
    apiKey: process.env.MISTRALAI_API_KEY,
    model: "mistral-small-latest",
    temperature: 0.2, // Lower temperature for more consistent structured outputs
  });

  // Bind the Zod schema directly to the model
  const structuredModel = model.withStructuredOutput(interviewReportZodSchema);

  const prompt = `
Act as a Senior Technical Interviewer. Analyze the provided data to generate a comprehensive Career Report.

🎯 ANALYSIS CRITERIA:
1. summary: Professional 3-line evaluation.
2. keywordAnalysis: Compare Resume vs Job Description for ATS optimization.
3. resumeIssues: At least 3 strings describing specific weaknesses in the resume.
4. improvementSuggestions: At least 3 actionable recommendations to enhance the resume and interview performance.
5. resumeRewrite: Transform a weak resume line into a high-impact, results-driven statement.
6. roadmap/gaps: Identify critical missing skills (High/Med/Low) with study resources.
7. Q&A: 5+ Technical (depth-focused) and 3+ Behavioral (STAR method) questions.
8. prepPlan: A realistic 5-day step-by-step action plan.
9. Overall Scoring: Provide overall score (0-100).
10. Match Scoring: Evaluate how well the candidate's profile matches the job requirements (0-100).
11. ATS Scoring: Assess the resume's effectiveness in passing Applicant Tracking Systems (0-100).

📥 INPUTS:
Job Description: ${jobdescribe}
Resume: ${resume}
Self-Bio: ${selfdescribe}
`;

  try {
    // Returns the fully parsed JavaScript object conforming to interviewReportZodSchema
    const report = await structuredModel.invoke(prompt);
    return report;
  } catch (error) {
    console.error("--- LANGCHAIN MISTRAL SERVICE ERROR ---");
    console.error("Message:", error.message);

    if (error.message?.includes("429") || error.message?.includes("rate limit")) {
      console.warn("Rate limit exceeded or high server demand.");
    }

    return null;
  }
}