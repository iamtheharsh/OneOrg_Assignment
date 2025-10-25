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
  "http://localhost:5173",               // for local dev
  "https://oneorgfrontend.vercel.app",   // your deployed frontend
];

// ✅ Robust CORS config for both local + deployed frontend
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

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ API Routes
app.use("/auth", authRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/insights", insightRoutes);

// ✅ Health check route
app.get("/", (req, res) => res.json({ message: "✅ Server running fine" }));

// ✅ Connect to DB before exporting app
await connectDB(process.env.MONGO_URI);

// ✅ Error handlers
app.use(notFound);
app.use(errorHandler);

// ❌ DO NOT USE app.listen() on Vercel
// ✅ Export the app for Vercel serverless function
export default app;
