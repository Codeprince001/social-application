import mongoose from "mongoose"
import {ENV} from "./env.js"

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGODB_URI)
        console.log("Connected to mongodb")
        
    } catch (error) {
        console.log("Error connecting to MONGODB")
        process.exit(1)
    }
}
