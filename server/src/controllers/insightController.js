import Insight from "../models/Insight.js";

// ✅ Create new insight
export const createInsight = async (req, res) => {
  try {
    const { questionId, summary } = req.body;

    if (!questionId || !summary)
      return res.status(400).json({ message: "Question ID and summary are required" });

    const insight = await Insight.create({
      questionId,
      summary,
      createdBy: req.user._id,
    });

    res.status(201).json(insight);
  } catch (err) {
    console.error("Error creating insight:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all insights
export const getAllInsights = async (req, res) => {
  try {
    const insights = await Insight.find()
      .populate("questionId", "title")
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });
    res.json(insights);
  } catch (err) {
    console.error("Error fetching insights:", err);
    res.status(500).json({ message: err.message });
  }
};
