// src/controllers/insightController.js
import Insight from "../models/Insight.js";

// Create an insight (manager only)
export const createInsight = async (req, res) => {
  try {
    const { questionId, summary } = req.body;
    if (!questionId || !summary) {
      return res.status(400).json({ message: "questionId and summary are required" });
    }

    const insight = await Insight.create({
      questionId,
      summary,
      createdBy: req.user._id,
    });

    res.status(201).json(insight);
  } catch (err) {
    console.error("❌ Error creating insight:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get insights for a single question
export const getInsightsByQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId || req.params.id;
    const insights = await Insight.find({ questionId })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(insights);
  } catch (err) {
    console.error("❌ Error fetching insights for question:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all insights (manager dashboard)
export const getAllInsights = async (req, res) => {
  try {
    const insights = await Insight.find({})
      .populate("questionId", "title description")
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(insights);
  } catch (err) {
    console.error("❌ Error fetching all insights:", err);
    res.status(500).json({ message: "Server error while fetching insights." });
  }
};
