import express from "express";
import { checkEligibility, createLoan, viewLoanById, viewLoansByCustomer } from "../controllers/loanController.controller.js";

const router = express.Router();

router.post("/check-eligibility", checkEligibility);
router.post("/create-loan", createLoan);
router.get("/view-loan/:loan_id", viewLoanById);
router.get("/view-loans/:customer_id", viewLoansByCustomer);

export default router;