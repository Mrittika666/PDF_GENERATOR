import mongoose from 'mongoose';

const connectDB = async () => {
    console.log("Connecting MongoDB...");
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected ✅");
    } catch (error) {
        console.log("MongoDB connection error ❌");
        console.log(error.message); // 👈 add this line to see full error
    }
    console.log("DB function finished");
};

export default connectDB;