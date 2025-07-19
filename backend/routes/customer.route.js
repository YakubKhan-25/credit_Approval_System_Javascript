import express from "express";
import { registerCustomer } from "../controllers/registerCustomer.controller.js";

const router = express.Router();

router.post("/register", registerCustomer);

export default router;