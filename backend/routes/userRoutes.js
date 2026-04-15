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
    deleteFile
} from "../controllers/userController.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================
router.post("/register", registerUser);
router.post("/verify", verification);
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPasswordWithOtp);
router.post("/resend-otp", resendResetOtp);

// ================= PROTECTED ROUTES =================
router.post("/logout", isAuthenticated, logoutUser);
router.post("/upgrade-premium", isAuthenticated, upgradeToPremium);



// ================= FILE ROUTES =================
router.post("/save-file", saveFileRecord);
router.get("/get-files/:email", getUserFiles);
router.post("/delete-file", deleteFile);

// ================= TEST ROUTE =================
router.get("/", (req, res) => {
    res.send("User route working");
});

export default router;