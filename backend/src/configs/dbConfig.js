import mongoose from 'mongoose';
import {DB_NAME} from "../constants.js"

const connectDb=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log("Database connected");
    } catch (error) {
        console.error(error);
    }
}
export default connectDb;