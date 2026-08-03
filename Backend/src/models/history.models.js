import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    historyTitle: {
      type: String,
      default: "User History",
    },

    analysisIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ResumeAnalysis",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const History = mongoose.model("History", historySchema);