import express from "express";
import { createAnswer, getAnswersByQuestion } from "../controllers/answerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAnswer);
router.get("/:questionId", protect, getAnswersByQuestion);

export default router;
