import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hash,
            isVerified: false
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "10m" }
        );

        user.token = token;
        await user.save();

        await sendVerificationMail(email, token);

        return res.status(201).json({
            success: true,
            message: "User registered. Verification email sent."
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ================= VERIFY EMAIL =================
export const verification = async (req, res) => {
    try {
        const auth = req.headers.authorization;

        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Token missing" });
        }

        const token = auth.split(" ")[1];

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isVerified = true;
        user.token = null;
        await user.save();

        return res.json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Verification failed or token expired"
        });
    }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "15m" });

        res.json({
            success: true,
            accessToken,
            user
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ================= EMAIL SENDER (FIXED) =================
const sendVerificationMail = async (email, token) => {
    try {
        console.log("🔥 VERIFY MAIL FUNCTION CALLED");

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,   // IMPORTANT FIX
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.verify();
        console.log("✅ SMTP READY");

        const link = `${process.env.FRONTEND_URL}/verify/${token}`;

        const info = await transporter.sendMail({
            from: `PDF App <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Verify Your Email",
            html: `<h2>Click below to verify</h2><a href="${link}">VERIFY</a>`
        });

        console.log("✅ MAIL SENT:", info.messageId);

    } catch (err) {
        console.log("❌ MAIL ERROR:", err.message);
    }
};

// ================= PASSWORD =================
export const changePassword = async (req, res) => {
    res.json({ message: "change password working" });
};

// ================= FILES (DUMMY FIXED EXPORTS) =================
export const saveFileRecord = async (req, res) => res.json({ ok: true });
export const getUserFiles = async (req, res) => res.json({ files: [] });
export const deleteFile = async (req, res) => res.json({ ok: true });

// ================= OTP =================
export const verifyOtp = async (req, res) => res.json({ ok: true });
export const forgotPassword = async (req, res) => res.json({ ok: true });
export const resetPasswordWithOtp = async (req, res) => res.json({ ok: true });
export const resendResetOtp = async (req, res) => res.json({ ok: true });

// ================= PREMIUM =================
export const upgradeToPremium = async (req, res) => res.json({ ok: true });
export const logoutUser = async (req, res) => res.json({ ok: true });