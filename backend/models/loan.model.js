import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    loan_id: { type: Number, unique: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    loan_amount: Number,
    interest_rate: Number,
    tenure: Number, // in months
    monthly_installment: Number,
    emis_paid_on_time: Number,
    start_date: Date,
    end_date: Date,
  },
  { timestamps: true }
);

loanSchema.virtual("repayments_left").get(function () {
  return this.tenure - this.emis_paid_on_time;
});

export const Loan = mongoose.model("Loan", loanSchema);
