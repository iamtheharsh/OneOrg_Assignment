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

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://oneorgfrontend.vercel.app", // your deployed frontend
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Parse JSON
app.use(express.json());

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/insights", insightRoutes);

// ✅ Health check
app.get("/", (req, res) => res.json({ message: "✅ Server running fine" }));

// ✅ Error handlers (keep these below routes)
app.use(notFound);
app.use(errorHandler);

// ✅ Initialize DB connection before exporting app
let isConnected = false;

async function initApp() {
  if (!isConnected) {
    try {
      await connectDB(process.env.MONGO_URI);
      isConnected = true;
      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err.message);
    }
  }
  return app;
}

// ✅ Export async handler for Vercel
export default async function handler(req, res) {
  const initializedApp = await initApp();
  return initializedApp(req, res);
}
