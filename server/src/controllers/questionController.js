import Question from "../models/Question.js";

// POST /questions - create new question
export const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    if (!title || !description)
      return res.status(400).json({ message: "Title and description are required" });

    const question = await Question.create({
      title,
      description,
      tags,
      createdBy: req.user._id,
    });

    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /questions - get all questions (with search)
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
