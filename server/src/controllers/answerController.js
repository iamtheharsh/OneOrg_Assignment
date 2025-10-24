import Answer from "../models/Answer.js";

// POST /answers - create a new answer
export const createAnswer = async (req, res) => {
  try {
    const { questionId, answerText } = req.body;

    if (!questionId || !answerText)
      return res.status(400).json({ message: "Question ID and answer text are required" });

    const answer = await Answer.create({
      questionId,
      answerText,
      createdBy: req.user._id,
    });

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /answers/:questionId - fetch all answers for a question
export const getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
