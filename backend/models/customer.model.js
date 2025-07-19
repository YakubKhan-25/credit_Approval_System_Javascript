import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customer_id: { type: Number, unique: true },
    first_name: String,
    last_name: String,
    phone_number: String,
    age: Number,
    monthly_income: Number,
    approved_limit: Number,
    current_debt: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
