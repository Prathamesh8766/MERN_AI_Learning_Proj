import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connect to MongoDB ${conn.connection.host}`);

    }catch(error){
        console.error(`Error in MongoDB Connection ${error.message}`);
        process.exit(1);
    }
}

