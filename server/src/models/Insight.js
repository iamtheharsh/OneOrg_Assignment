import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  summary: { type: String, required: true }, // ✅ consistent with frontend
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Insight = mongoose.model("Insight", insightSchema);
export default Insight;
