import express from "express";
import {
  createAnswer,
  getAnswersByQuestion,
  toggleUpvote,
} from "../controllers/answerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAnswer);            // post answer
router.get("/:id", protect, getAnswersByQuestion);  // get answers for question
router.put("/upvote/:id", protect, toggleUpvote);   // upvote toggle

export default router;
