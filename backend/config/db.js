import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({});

export const connectToDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected : ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB not Connected : ${error}`);
        process.exit(1);
    }
}