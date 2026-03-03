import express from "express";
import {
    registerUser,
    verification,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPasswordWithOtp,
    resendResetOtp,
    changePassword,
    verifyOtp,
    upgradeToPremium,
    saveFileRecord,
    getUserFiles,
    deleteFile// Ensure this is here
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/verify", verification);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPasswordWithOtp);
router.post("/resend-otp", resendResetOtp);

// Protected Routes (Require Login)
router.post("/logout", isAuthenticated, logoutUser);
router.post("/change-password", isAuthenticated, changePassword);
router.post("/upgrade-premium", isAuthenticated, upgradeToPremium);
// Naye routes add karein
router.post("/save-file", saveFileRecord);
router.get("/get-files/:email", getUserFiles);
router.post("/delete-file", deleteFile);
export default router;