
import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    // user reference (renamed from userId → user)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // main details
    title: {
      type: String,
      required: true,
    },

    // NEW FIELD (from code 2)
    type: {
      type: String,
      default: "Expense",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      required: true,
      enum: ["USD", "AED", "INR", "CAD", "AUD"],
      default: "INR",
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Salaries",
        "Incentives",
        "Rent",
        "Travel Allowance Agent",
        "Travel Allowance Owner",
        "Meta Recharge",
        "Chargeback",
        "Refunds",
        "Miscellaneous Expenses",
        "Call Payment",
        "RDP Payment",
        "Ticket Issuance Pay",
        "API Payment",
        "Website Expenses",
        "Vonage Payment",
        "PPC Call Payment",
        "Campaign Payment",
        "Others",
      ],
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // optional project field
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", ExpenseSchema);
