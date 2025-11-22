
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// =============================
// 📌 Register User
// =============================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check for existing admin
    const adminExists = await User.findOne({ role: "admin" });

    // If user tries to register as admin but admin already exists → Block
    if (role === "admin" && adminExists) {
      return res.status(400).json({
        success: false,
        message: "Only one admin account is allowed",
      });
    }

    // Auto-assign role:
    // If no admin exists → first user becomes admin
    // If admin exists → new user becomes guest
    const finalRole = adminExists ? "guest" : "admin";

    // But if user manually sent a role=guest → allow guest
    const assignedRole = role === "guest" ? "guest" : finalRole;

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    res.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// =============================
// 📌 Login User
// =============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============================
// 📌 Get Logged-in User Profile
// =============================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
