import { verifyMail } from "../emailverify/verifyMail.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// ======================== REGISTER ========================
export const registerUser = async (req, res) => {
    try {
        console.log("🔥 REGISTER API HIT");
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashPassword,
            isVerified: false
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "10m" }
        );

        newUser.token = token;
        await newUser.save();

        console.log("➡️ Calling verifyMail...");

        const mailSent = await verifyMail(token, email);

        console.log("⬅️ verifyMail returned:", mailSent);

        if (!mailSent) {
            return res.status(500).json({
                success: false,
                message: "User created but email failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Signup successful. Email sent."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================== VERIFY ========================
export const verification = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decoded.id);

        user.isVerified = true;
        user.token = null;

        await user.save();

        res.json({ success: true, message: "Verified" });

    } catch {
        res.status(400).json({ success: false, message: "Invalid token" });
    }
};

// ======================== LOGIN ========================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid" });

        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(400).json({ message: "Invalid" });

        if (!user.isVerified) {
            return res.status(400).json({ message: "Verify email first" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

        res.json({ success: true, token, user });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// ======================== LOGOUT ========================
export const logoutUser = async (req, res) => {
    res.json({ success: true });
};

// ======================== FILE ========================
export const saveFileRecord = async (req, res) => {
    res.json({ success: true });
};

export const getUserFiles = async (req, res) => {
    res.json({ success: true });
};

export const deleteFile = async (req, res) => {
    res.json({ success: true, message: "Deleted" });
};

// ======================== OTHERS ========================
export const forgotPassword = async (req, res) => {
    res.json({ success: true });
};

export const verifyOtp = async (req, res) => {
    res.json({ success: true });
};

export const resetPasswordWithOtp = async (req, res) => {
    res.json({ success: true });
};

export const resendResetOtp = async (req, res) => {
    res.json({ success: true });
};

export const changePassword = async (req, res) => {
    res.json({ success: true });
};

export const upgradeToPremium = async (req, res) => {
    res.json({ success: true });
};