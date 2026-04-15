import { verifyMail } from "../emailverify/verifyMail.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// ======================== REGISTER ========================
export const registerUser = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);

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

        // 🔥 SAFE EMAIL SEND (won't crash server)
        const mailSent = await verifyMail(token, email);

        if (!mailSent) {
            console.log("⚠️ Email failed but user created");
        }

        newUser.token = token;
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Signup successful. Check email to verify account."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================== VERIFY EMAIL ========================
export const verification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isVerified = true;
        user.token = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Verification failed or expired token"
        });
    }
};

// ======================== LOGIN ========================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 🔥 IMPORTANT SECURITY CHECK
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email first"
            });
        }

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        user.refreshToken = refreshToken;
        user.isLoggedIn = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.username}`,
            accessToken,
            refreshToken,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================== LOGOUT ========================
export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;

        await User.findByIdAndUpdate(userId, {
            refreshToken: null,
            isLoggedIn: false
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================== FORGOT PASSWORD ========================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If email exists, OTP sent"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Password Reset OTP",
            html: `<h2>${otp}</h2>`
        });

        console.log("OTP EMAIL SENT");

        return res.status(200).json({
            success: true,
            message: "OTP sent to email"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Email sending failed"
        });
    }
};


//=======================change password===============
export const changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};