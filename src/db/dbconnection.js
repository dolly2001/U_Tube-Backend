import mongoose from "mongoose";
import DB_NAME from "../constants.js"

const connectDB = async () => {
        try {
            const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_NAME}`)
            console.log(`MONGODB DATABASE CONNECTED SUCCESSFULLY !!!  \nDB HOST ${connectionInstance.connection.host} `);
        } catch (error) {
            console.log(`DATABASE CONNECTION FAILED ${error}`);
            process.exit(0)
        }
}

export default connectDB