import mongoose, { Schema } from "mongoose";

/**
 * Sub Schemas
 */

// ✅ Common Question Schema
const questionSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    intention: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// ✅ Skill Gap
const skillGapSchema = new Schema(
  {
    skill: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
  },
  { _id: false }
);

// ✅ Preparation Plan
const preparationPlanSchema = new Schema(
  {
    day: { type: Number, required: true, min: 1 },
    focus: { type: String, required: true, trim: true },
    task: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/**
 * Main Schema
 */

const interviewReportSchema = new Schema(
  {
    // 👤 User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📥 Inputs
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    selfDescription: {
      type: String,
      required: true,
      trim: true,
    },

    // 🧠 AI Summary
    summary: {
      type: String,
      trim: true,
    },

    // 💪 Strengths & Issues
    strengths: {
      type: [String],
      default: [],
    },

    resumeIssues: {
      type: [String],
      default: [],
    },

    improvementSuggestions: {
      type: [String],
      default: [],
    },

    // 🔍 Keyword Analysis (NEW)
    keywordAnalysis: {
      matchedKeywords: {
        type: [String],
        default: [],
      },
      missingKeywords: {
        type: [String],
        default: [],
      },
      keywordMatchPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
    },

    // ✨ Resume Rewrite (NEW)
    resumeRewrite: {
      before: { type: String },
      after: { type: String },
    },

    // 📚 Learning Roadmap
    learningRoadmap: {
      type: [
        {
          skill: String,
          priority: {
            type: String,
            enum: ["high", "medium", "low"],
          },
          reason: String,
          resources: [String],
        },
      ],
      default: [],
    },

    // ❓ Questions
    technicalQuestions: {
      type: [questionSchema],
      default: [],
    },

    behavioralQuestions: {
      type: [questionSchema],
      default: [],
    },

    // 📉 Skill Gaps
    skillGaps: {
      type: [skillGapSchema],
      default: [],
    },

    // 📅 Preparation Plan
    preparationPlan: {
      type: [preparationPlanSchema],
      default: [],
    },

    // 📊 Scores
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// ⚡ Index for performance
interviewReportSchema.index({ user: 1, createdAt: -1 });

export const InterviewReport = mongoose.model(
  "InterviewReport",
  interviewReportSchema
);