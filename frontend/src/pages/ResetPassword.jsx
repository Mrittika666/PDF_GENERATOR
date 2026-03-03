import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const ResetPassword = () => {
    const { email, otp } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleReset = async () => {
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        try {
            setIsLoading(true);

            const res = await axios.post("http://localhost:3000/user/reset-password", {
                email,
                otp,
                newPassword
            });

            if (res.data.success) {
                toast.success("Password reset successful! Please login.");
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Reset failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-black text-slate-800 mb-2">Set New Password</h2>
                <p className="text-slate-500 text-sm mb-6">Enter a strong password for your account.</p>

                <div className="space-y-4">
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button className="w-full bg-blue-600 py-6" onClick={handleReset} disabled={isLoading}>
                        {isLoading ? "Updating..." : "Reset Password"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;