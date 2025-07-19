import { Loan } from "../models/loan.model.js";
import { Customer } from "../models/customer.model.js";

export const calculateCreditScore = async (customer_id) => {
  try {
    // Find the customer by customer_id (number)
    const customer = await Customer.findOne({ customer_id });
    if (!customer) return 0;
    const loans = await Loan.find({ customer_id: customer._id });
    if (!loans.length) return 100;

    const currentYear = new Date().getFullYear();
    let score = 100;

    const onTimeEMIs = loans.reduce(
      (sum, loan) => sum + loan.emis_paid_on_time,
      0
    );
    const totalEMIs = loans.reduce((sum, loan) => sum + loan.tenure, 0);
    const loanCount = loans.length;
    const loanVolume = loans.reduce((sum, loan) => sum + loan.loan_amount, 0);
    const currentYearLoans = loans.filter(
      (loan) => new Date(loan.start_date).getFullYear() === currentYear
    ).length;

    const totalDebt = loans.reduce(
      (sum, loan) =>
        sum + loan.monthly_payment * (loan.tenure - loan.emis_paid_on_time),
      0
    );
    if (totalDebt > customer.approved_limit) return 0;

    score -= loanCount > 5 ? 10 : 0;
    score -= onTimeEMIs / totalEMIs < 0.75 ? 20 : 0;
    score -= currentYearLoans > 2 ? 10 : 0;
    score -= loanVolume > customer.approved_limit * 1.5 ? 15 : 0;

    return Math.max(0, Math.round(score));
  } catch (error) {
    console.log(error);
  }
};

export const calculateEMI = (principal, annualInterestRate, tenureMonths) => {
  try {
    const R = annualInterestRate / 12 / 100;
    const N = tenureMonths;
    const EMI = (principal * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    return parseFloat(EMI.toFixed(2));
  } catch (error) {
    console.log(error);
  }
};

export const checkEligibilityService = async (body) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = body;
    // Find the customer by customer_id (number)
    const customer = await Customer.findOne({ customer_id });
    if (!customer) {
      throw new Error("Customer not found");
    }
    const credit_score = await calculateCreditScore(customer_id);

    let approval = false;
    let corrected_interest_rate = interest_rate;

    const loans = await Loan.find({ customer_id: customer._id });
    const existingEMIs = loans.reduce(
      (sum, loan) => sum + loan.monthly_payment,
      0
    );
    const maxAllowedEMIs = customer.monthly_salary * 0.5;

    if (credit_score > 50) approval = true;
    else if (credit_score > 30 && interest_rate > 12) approval = true;
    else if (credit_score > 10 && interest_rate > 16) approval = true;

    if (credit_score <= 10 || existingEMIs > maxAllowedEMIs) {
      approval = false;
    }

    if (credit_score > 50 && interest_rate < 10) corrected_interest_rate = 10;
    else if (credit_score > 30 && interest_rate < 12)
      corrected_interest_rate = 12;
    else if (credit_score > 10 && interest_rate < 16)
      corrected_interest_rate = 16;

    const monthly_payment = calculateEMI(
      loan_amount,
      corrected_interest_rate,
      tenure
    );

    return {
      customer_id,
      approval,
      interest_rate,
      corrected_interest_rate,
      tenure,
      monthly_payment,
    };
  } catch (error) {
    console.log(error);
  }
};
