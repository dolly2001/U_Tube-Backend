import { app } from "./app.js";
import connectDB from "./db/dbconnection.js";
import dotenv from "dotenv"

dotenv.config({
    path : "./env"
})

connectDB()

.then(() => {

    app.on("error", (error) => {
        console.log(error);
        process.exit(1)
    })

    app.listen(process.env.PORT || 4000 , () => {
        console.log(`YOUR SERVER IS LIVE NOW ON PORT ${process.env.PORT}`);
    })

})

.catch((err) => {
    console.log(`DATABASE CONNECTION ERROR : ${err}`);
})