import { verifyMail } from "../emailverify/verifyMail.js";
import { User } from "../models/userModel.js";
import { Session } from "../models/sessionModel.js"; // make sure Session is imported
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
            password: hashPassword
        });

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "10m" });
        await verifyMail(token, email); // send verification email
        newUser.token = token;
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User is successfully registered",
            data: newUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing or invalid"
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                });
            }
            return res.status(400).json({
                success: false,
                message: "Token verification failed"
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.token = null;
        user.isVerified = true; // camelCase
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

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

      //  if (!user.isVerified) {
       //     return res.status(400).json({
        //        success: false,
         //       message: "Verify your account first"
         //   });
       // }

        // ✅ Generate Access Token
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "15m" }
        );

        // ✅ Generate Refresh Token
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        // ✅ Save refresh token & login status in DB
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
export const logoutUser = async (req, res) => {
    try {

        const userId = req.userId;   // ✅ FIXED

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

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 🔥 Added: Basic validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        // 🔥 Security improvement:
        // Do not reveal whether user exists or not
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If this email is registered, OTP has been sent"
            });
        }

        // 🔥 Generate secure 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Password Reset OTP",
            html: `
          <h3>Your Password Reset OTP</h3>
          <h2>${otp}</h2>
          <p>This OTP will expire in 10 minutes.</p>
        `
        });

        res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const resetPasswordWithOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;


        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({
            email,
            resetOtp: otp,
            resetOtpExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }


        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;


        user.resetOtp = null;
        user.resetOtpExpiry = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const resendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate new OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOtp = newOtp;
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Resend Password Reset OTP",
            html: `
          <h3>Your New OTP</h3>
          <h2>${newOtp}</h2>
          <p>This OTP will expire in 10 minutes.</p>
        `
        });

        res.status(200).json({
            success: true,
            message: "New OTP sent to your email"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.userId; // from JWT middleware
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // Hash new password
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

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;


        const user = await User.findOne({
            email,
            resetOtp: otp,
            resetOtpExpiry: { $gt: Date.now() }
        });

        if (!user) {

            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

import puppeteer from 'puppeteer-core';

export const generatePdf = async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            // Windows users ke liye Chrome ka default path:
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true
        });

        const page = await browser.newPage();

        // ... baki sara code same rahega ...
        const htmlContent = `<h1 style="color: green;">Success!</h1><p>PDF generated for ${req.userId}</p>`;

        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        res.set({ 'Content-Type': 'application/pdf' });
        res.send(pdfBuffer);
    } catch (error) {
        console.log(error);
        res.status(500).send("PDF generation failed: " + error.message);
    }
};



export const upgradeToPremium = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });


        user.subscription = "premium";
        user.pdfCount = 0;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Success! Your account is now Premium."
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// 1. Save File Record
export const saveFileRecord = async (req, res) => {
    try {
        const { email, fileName } = req.body;
        const user = await User.findOneAndUpdate(
            { email },
            {
                $push: { files: { fileName } }, // Array mein file add karein
                $inc: { generatedCount: 1 }     // Count 1 badhayein
            },
            { new: true }
        );
        res.status(200).json({ success: true, files: user.files });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get All Files (Read)
export const getUserFiles = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        res.status(200).json({ success: true, files: user.files });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Delete File (Delete)
export const deleteFile = async (req, res) => {
    try {
        const { email, fileId } = req.body;
        const user = await User.findOneAndUpdate(
            { email },
            { $pull: { files: { _id: fileId } } }, // ID se file remove karein
            { new: true }
        );
        res.status(200).json({ success: true, files: user.files });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};