import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
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

const History = mongoose.model("History", historySchema);

export default History;