
// import express from "express";
// import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";
// import { protect } from "../middleware/auth.js";

// const router = express.Router();

// // Register
// router.post("/signup", registerUser);

// // Login
// router.post("/login", loginUser);

// // Get user profile
// router.get("/profile", protect, getUserProfile);

// // ✔ MUST export default
// export default router;
//========================================


import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  changeUserPassword 
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const router = express.Router();

// Auth
router.post("/signup", registerUser);
router.post("/login", loginUser);

// User Profile
router.get("/profile", protect, getUserProfile);

// CHANGE PASSWORD (ADMIN CAN CHANGE ANY USER)
router.put("/change-password/by-email/:email", protect, adminOnly, changeUserPassword);

export default router;

