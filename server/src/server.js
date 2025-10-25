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

// ✅ Adjust this to allow both local & deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://oneorgfrontend.vercel.app", // frontend deploy URL (replace after deploy)
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/insights", insightRoutes);

app.get("/", (req, res) => res.json({ message: "✅ Server running fine" }));

// connect DB before exporting app
await connectDB(process.env.MONGO_URI);

// error handling
app.use(notFound);
app.use(errorHandler);

// ❌ Remove app.listen()
// ✅ Instead export the app for Vercel
export default app;
