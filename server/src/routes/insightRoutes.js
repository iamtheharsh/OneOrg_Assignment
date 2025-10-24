// src/routes/insightRoutes.js
import express from "express";
import {
  createInsight,
  getInsightsByQuestion,
  getAllInsights,
} from "../controllers/insightController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Manager dashboard (all insights)
router.get("/", protect, authorizeRoles("manager"), getAllInsights);

// Insights for a specific question (any authenticated user)
router.get("/:questionId", protect, getInsightsByQuestion);

// Create insight (manager only)
router.post("/", protect, authorizeRoles("manager"), createInsight);

export default router;
