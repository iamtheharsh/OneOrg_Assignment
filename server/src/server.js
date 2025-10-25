import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./utils/errorHandler.js";

dotenv.config();

const app = express();

// ✅ FIXED CORS CONFIG
app.use(
  cors({
    origin: "http://localhost:5173", // your React dev URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// explicitly handle OPTIONS for preflight
// app.options("/*", cors());

// middlewares
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/insights", insightRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server running fine" });
});

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.use(notFound);
    app.use(errorHandler);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
})();
