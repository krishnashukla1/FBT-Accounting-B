import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    // NEW FIELD (updated)
    type: {
      type: String,
      default: "Income",
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
      enum: [
        "MCO Meta",
        "MCO PPC",
        "Meta Rental",
        "Commission",
        "Technology Sale",
        "Domestic Tour Package",
        "International Tour Package",
        "Airline Ticket",
        "Hotel",
        "Car Hire",
        "Activities",
        "Airport Transfers",
        "Visa",
        "Others",
      ],
      default: "Others",
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

    // optional project
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Income", IncomeSchema);




