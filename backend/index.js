import express from "express";
import mongoose from "mongoose";
import customerRouter from "./routes/customer.route.js";
import loanRouter from "./routes/loan.route.js";
import { connectToDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config({});

connectToDB();

const app = express();
const PORT = process.env.BACKEND_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));




app.use("/api/v1/auth", customerRouter);
app.use("/api/v1/loan", loanRouter);

app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Server is running at PORT : ${PORT}`);
})