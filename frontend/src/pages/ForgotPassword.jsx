import React, { useState } from "react";

import { Input } from "../components/ui/input";


import { Button } from "../components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await axios.post("http://localhost:3000/user/forgot-password", { email });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate(`/verify-otp/${email}`); // redirect to OTP verification
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">Forgot Password</h2>
                <Input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button type="submit" className="w-full mt-4">
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
            </form>
        </div>
    );
};

export default ForgotPassword;