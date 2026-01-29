import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from './routes/documentRoutes.js'
import flashcardRouter from "./routes/flashcardRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import quizRouter from './routes/quizRoutes.js'
import dashboardRouter from './routes/progressRoutes.js'
// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1️⃣ Create app FIRST
const app = express();

// 2️⃣ Body parsers (VERY IMPORTANT)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3️⃣ Connect DB
connectDB();

// 4️⃣ CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 5️⃣ Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 6️⃣ Routes
app.use("/api/auth", authRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/flashcard", flashcardRouter);
app.use('/api/ai/genreter',aiRouter);
app.use('/api/quizzes',quizRouter)
app.use ('/api',dashboardRouter)


// 7️⃣ Error handler (ALWAYS AFTER ROUTES)
app.use(errorHandler);

// 8️⃣ 404 handler (LAST)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not Found",
    statusCode: 404,
  });
});

// 9️⃣ Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

// 🔟 Catch unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
