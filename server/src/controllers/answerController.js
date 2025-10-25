import Answer from "../models/Answer.js";

// ✅ Create a new answer
export const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;

    if (!questionId || !content)
      return res.status(400).json({ message: "Question ID and content are required" });

    const answer = await Answer.create({
      questionId,
      content,
      createdBy: req.user._id,
    });

    res.status(201).json(answer);
  } catch (err) {
    console.error("Error creating answer:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all answers for a question
export const getAnswersByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const answers = await Answer.find({ questionId })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(answers);
  } catch (err) {
    console.error("Error fetching answers:", err);
    res.status(500).json({ message: err.message });
  }
};
