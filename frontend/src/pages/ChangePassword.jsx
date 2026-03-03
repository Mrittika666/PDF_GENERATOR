import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const ChangePassword = () => {
    const { email, otp } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post("http://localhost:3000/user/reset-password", { email, otp, newPassword });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">Set New Password</h2>
                <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <Button className="w-full mt-4" onClick={handleChangePassword}>
                    {isLoading ? "Updating..." : "Change Password"}
                </Button>
            </div>
        </div>
    );
};

export default ChangePassword;