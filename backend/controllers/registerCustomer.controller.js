import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Customer } from "../models/customer.model.js";

function roundToLakh(value) {
  return Math.round((36 * value) / 100000) * 100000;
}

export const registerCustomer = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, age, monthly_income } =
      req.body;

    const approved_limit = roundToLakh(monthly_income);
    // Find the highest customer_id in the collection
    const lastCustomer = await Customer.findOne().sort({ customer_id: -1 });
    const customer_id = lastCustomer ? lastCustomer.customer_id + 1 : 1000;

    const newCustomer = new Customer({
      customer_id,
      first_name,
      last_name,
      age,
      monthly_income,
      approved_limit,
      phone_number,
    });

    await newCustomer.save();

    res.status(201).json({
      customer_id,
      name: `${first_name} ${last_name}`,
      age,
      monthly_income,
      approved_limit,
      phone_number,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to Register",
    });
  }
};
