import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// 1. Optimized CORS for Production
app.use(cors({
    origin: "https://pdf-generator-teal.vercel.app", // No function, just the string
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. Routes
app.use("/api/user", userRoutes);

// 3. Health Check Route (Important for Render)
app.get("/", (req, res) => res.status(200).send("API is running "));

// 4. FIX: Start server IMMEDIATELY
// This prevents the Render "Port Binding" timeout error.
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is live and listening on port ${PORT} ✅`);
});

// 5. Connect to Database in the background
connectDB()
    .then(() => {
        console.log("MongoDB Connection Established ✅");
    })
    .catch((err) => {
        console.error("Critical: MongoDB Connection Failed ❌", err);
    });