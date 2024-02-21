import connectDB from "./db/dbconnection.js";
import dotenv from "dotenv"

dotenv.config({
    path : "./env"
})

connectDB()
