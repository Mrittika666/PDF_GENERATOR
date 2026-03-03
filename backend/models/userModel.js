import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    resetOtp: { type: String, default: null },
    resetOtpExpiry: { type: Date, default: null },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    pdfCount: { type: Number, default: 0 },
    subscription: { type: String, enum: ["free", "premium"], default: "free" },
    isPremium: { type: Boolean, default: false },
    generatedCount: { type: Number, default: 0 },
    files: [{
        fileName: String,
        fileUrl: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);