import Answer from "../models/Answer.js";

// ➕ Post new answer
export const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const answer = await Answer.create({
      questionId,
      content,
      createdBy: req.user._id,
    });
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get answers for a question
export const getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.id })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔼 Toggle upvote
export const toggleUpvote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const answer = await Answer.findById(id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const alreadyUpvoted = answer.upvotes.includes(userId);
    if (alreadyUpvoted) {
      answer.upvotes.pull(userId);
    } else {
      answer.upvotes.push(userId);
    }
    await answer.save();

    res.json({ success: true, upvotes: answer.upvotes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
