
import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/signup", registerUser);

// Login
router.post("/login", loginUser);

// Get user profile
router.get("/profile", protect, getUserProfile);

// ✔ MUST export default
export default router;
