import express from "express";
import { createAnswer, getAnswersByQuestion } from "../controllers/answerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ post new answer
router.post("/", protect, createAnswer);

// ✅ get answers for a specific question
router.get("/:questionId", protect, getAnswersByQuestion);

export default router;
