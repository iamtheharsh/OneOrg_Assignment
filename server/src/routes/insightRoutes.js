import express from "express";
import { createInsight, getAllInsights } from "../controllers/insightController.js";
import { protect, managerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, managerOnly, createInsight);
router.get("/", protect, managerOnly, getAllInsights);

export default router;
