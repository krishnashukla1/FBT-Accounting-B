
import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import Income from '../models/Income.js'
import Expense from '../models/Expense.js'


import {
  addIncome,
  addExpense,
  getIncomes,
  getExpenses,
  updateIncome,
  updateExpense,
  deleteIncome,
  deleteExpense,
  downloadFinanceExcel,
  getLiveExchangeRates,
  getProjectSummary
} from "../controllers/financeController.js";

const router = express.Router();

// 🔐 Protect all finance routes
router.use(protect);

// 🟦 Debug Logger
router.use((req, res, next) => {
  console.log(`💰 Finance Route: ${req.method} ${req.path}`);
  console.log("User:", req.user);
  console.log("Body:", req.body);
  next();
});

// ===============================
// 📌 Income Routes
// ===============================
router.post("/income", addIncome);
router.get("/incomes", getIncomes);
router.put("/income/:id", updateIncome);
router.delete("/income/:id", deleteIncome);

// ===============================
// 📌 Expense Routes
// ===============================
router.post("/expense", addExpense);
router.get("/expenses", getExpenses);
router.put("/expense/:id", updateExpense);
router.delete("/expense/:id", deleteExpense);

// ===============================
// 📌 Summary + Excel + Currency
// ===============================
router.get("/download", downloadFinanceExcel);
router.get("/rates", getLiveExchangeRates);
router.get("/summary", getProjectSummary);


// GUEST-ONLY ROUTES — SEE ALL DATA IN PROJECT (NO user filter)
router.get("/guest/incomes", protect, async (req, res) => {
  try {
    const { project } = req.query;
    if (!project) {
      return res.status(400).json({ success: false, error: "Project ID required" });
    }

    const incomes = await Income.find({ project })
      .sort({ date: -1 })
      .select("title amount currency category paymentMethod description date");

    res.json({ success: true, incomes });
  } catch (err) {
    console.error("Guest incomes error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/guest/expenses", protect, async (req, res) => {
  try {
    const { project } = req.query;
    if (!project) {
      return res.status(400).json({ success: false, error: "Project ID required" });
    }

    const expenses = await Expense.find({ project })
      .sort({ date: -1 })
      .select("title amount currency category paymentMethod description date");

    res.json({ success: true, expenses });
  } catch (err) {
    console.error("Guest expenses error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// 📦 Export Router
// ===============================
export default router;
