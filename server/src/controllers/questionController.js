import Question from "../models/Question.js";

// ➕ Create
export const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.user._id;

    const question = await Question.create({
      title,
      description,
      tags,
      createdBy: userId,
    });

    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get All (+ search)
export const getQuestions = async (req, res) => {
  try {
    const search = req.query.search || "";
    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    };

    const questions = await Question.find(query)
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get By ID
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "createdBy",
      "name role"
    );
    if (!question) return res.status(404).json({ message: "Not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
