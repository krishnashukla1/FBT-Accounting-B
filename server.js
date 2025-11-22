
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import financeRoutes from "./routes/financeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();

// =============================
// 🔐 Middleware
// =============================
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// =============================
// 📌 API Routes
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/projects", projectRoutes);

// =============================
// 🌍 Root Route
// =============================
app.get("/", (req, res) => {
  res.send("Finance Backend Running...");
});

// =============================
// 🔗 MongoDB Connection
// =============================
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// =============================
// 🚀 Start Server
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
