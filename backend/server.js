import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ✅ CORS configuration for frontend
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// Database connection
connectDB();

// Routes
app.use("/user", userRoute);

// Test route (VERY IMPORTANT for debugging)
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Listen on all network interfaces
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});