import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connnectTODB = async () => {
  try {        
    
    const connected = await mongoose.connect(process.env.MONGODB_URL);
    if (connected) console.log('conneced to db')
  } catch (e) {
    console.error(e.message)
  }
}

