import express from "express";
import { createQuestion, getQuestions } from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createQuestion);
router.get("/", protect, getQuestions);

export default router;
