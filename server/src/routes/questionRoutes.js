import express from "express";
import {
  createQuestion,
  getQuestions,
  getQuestionById,
} from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createQuestion);
router.get("/", protect, getQuestions);
router.get("/:id", protect, getQuestionById);

export default router;
