import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const VerifyOTP = () => {
    const { email } = useParams();
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerify = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post("http://localhost:3000/user/verify-otp", { email, otp });
            if (res.data.success) {
                toast.success("OTP verified. You can now reset password.");
                navigate(`/change-password/${email}/${otp}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">Enter OTP</h2>
                <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <Button className="w-full mt-4" onClick={handleVerify} disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
            </div>
        </div>
    );
};

export default VerifyOTP;