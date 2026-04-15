import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
console.log("ENV TEST:", process.env.MONGO_URI);// ← explicit path

import express from "express";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

connectDB();

app.use("/user", userRoute);
app.get("/", (req, res) => res.send("API is running 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));