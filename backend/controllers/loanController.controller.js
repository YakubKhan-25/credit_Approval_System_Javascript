import { Loan } from "../models/loan.model.js";
import { Customer } from "../models/customer.model.js";
import { checkEligibilityService } from "./calculate.js";

export const checkEligibility = async (req, res) => {
  try {
    const result = await checkEligibilityService(req.body);
    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLoan = async (req, res) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;
    // Find the customer by customer_id (number)
    const customer = await Customer.findOne({ customer_id });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const eligibility = await checkEligibilityService({
      customer_id,
      loan_amount,
      interest_rate,
      tenure,
    });

    if (!eligibility.approval) {
      return res.status(400).json({
        loan_id: null,
        customer_id,
        loan_approved: false,
        message: "Loan not approved based on eligibility criteria",
        monthly_installment: null,
      });
    }

    // Find the highest loan_id in the collection
    const lastLoan = await Loan.findOne().sort({ loan_id: -1 });
    const loan_id = lastLoan ? lastLoan.loan_id + 1 : 1000;
    const start_date = new Date();
    const end_date = new Date();
    end_date.setMonth(end_date.getMonth() + tenure);

    const loan = new Loan({
      loan_id,
      customer_id: customer._id, // Use ObjectId
      loan_amount,
      interest_rate: eligibility.corrected_interest_rate,
      tenure,
      monthly_installment: eligibility.monthly_payment, // FIXED
      emis_paid_on_time: 0,
      start_date,
      end_date,
    });

    await loan.save();

    // Update customer debt
    customer.current_debt += eligibility.monthly_payment; // FIXED
    await customer.save();

    res.status(201).json({
      loan_id,
      customer_id: customer._id,
      loan_approved: true,
      message: "Loan approved and created",
      monthly_installment: eligibility.monthly_payment, // FIXED
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const viewLoanById = async (req, res) => {
  try {
    const loan = await Loan.findOne({ loan_id: req.params.loan_id }).populate(
      "customer_id"
    );

    if (!loan) return res.status(404).json({ error: "Loan not found" });

    const customer = loan.customer_id;

    res.json({
      loan_id: loan.loan_id,
      customer: {
        id: customer.customer_id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone_number: customer.phone_number,
        age: customer.age,
      },
      loan_amount: loan.loan_amount,
      interest_rate: loan.interest_rate,
      monthly_installment: loan.monthly_installment,
      tenure: loan.tenure,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const viewLoansByCustomer = async (req, res) => {
  try {
    // Find the customer by customer_id (number)
    const customer = await Customer.findOne({
      customer_id: req.params.customer_id,
    });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const loans = await Loan.find({ customer_id: customer._id });

    const results = loans.map((loan) => ({
      loan_id: loan.loan_id,
      loan_amount: loan.loan_amount,
      interest_rate: loan.interest_rate,
      monthly_installment: loan.monthly_installment,
      repayments_left: loan.tenure - loan.emis_paid_on_time,
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
