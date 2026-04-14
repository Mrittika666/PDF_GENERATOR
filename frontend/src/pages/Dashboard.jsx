import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "../components/ui/button";
import { toast } from 'sonner';
import {
    Loader2, FileText, Crown, LogOut,
    Zap, History, ShieldCheck, X, Image,
    Presentation, TableProperties, PenTool, Paintbrush, Trash2, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf"; // PDF ke liye
import FileManager from './FileManager'; // Humne jo naya file banaya


const Dashboard = ({ user }) => {
    // Console mein check karein (F12 dabakar browser mein dekhein)
    console.log("Dashboard User Data:", user);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center">
                    <Loader2 className="animate-spin text-green-600 w-10 h-10 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Setting up your workspace...</p>
                    <a href="/login" className="text-blue-500 mt-4 block underline">Back to Login</a>
                </div>
            </div>
        );
    }
    

    const [generating, setGenerating] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const navigate = useNavigate();

    // --- EXISTING PAYMENT LOGIC ---
    const confirmPayment = async () => {
        setIsUpgrading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.post("http://localhost:3000/user/upgrade-premium",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success("Payment Received! Welcome to Premium.");
                setShowQR(false);
                window.location.reload();
            }
        } catch (err) {
            toast.error("Verification failed. Please try again.");
        } finally {
            setIsUpgrading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        toast.success("Logged out");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] relative font-sans">

            {/* --- EXISTING QR MODAL --- */}
            {showQR && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] max-w-sm w-full p-8 shadow-2xl border border-slate-100 text-center relative">
                        <button onClick={() => setShowQR(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                            <X size={24} />
                        </button>
                        <Crown className="text-yellow-500 w-12 h-12 mx-auto mb-2" />
                        <h2 className="text-2xl font-black text-slate-900">Scan & Pay</h2>
                        <p className="text-slate-500 text-sm mb-6">Pay ₹499 to unlock Pro features</p>
                        <div className="bg-slate-50 p-6 rounded-3xl mb-6 border-2 border-dashed border-slate-200">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=YOUR_UPI_ID@okicici%26pn=PDFGenPro%26am=499%26cu=INR`}
                                alt="UPI QR"
                                className="mx-auto rounded-xl shadow-sm"
                            />
                            <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">GPay, PhonePe or Paytm</p>
                        </div>
                        <Button
                            onClick={confirmPayment}
                            disabled={isUpgrading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-7 rounded-2xl font-bold shadow-lg"
                        >
                            {isUpgrading ? <Loader2 className="animate-spin" /> : "I Have Paid (Verify)"}
                        </Button>
                    </div>
                </div>
            )}

            {/* --- NAVBAR (Same as before) --- */}
            <nav className="bg-white border-b sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-green-600 p-1 rounded-lg"><FileText className="text-white w-5 h-5" /></div>
                    <span className="text-xl font-black italic">PDF<span className="text-green-600">PRO</span></span>
                </div>
                <div className="flex items-center gap-4">
                    {user?.isPremium && <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1"><Crown size={12} /> Pro Member</span>}
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500">
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </nav>

            {/* --- NEW UPDATED BODY --- */}
            <main className="max-w-6xl mx-auto py-12 px-6">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back, {user?.username}! 👋</h1>
                    <p className="text-slate-500 font-medium">Create, manage, and secure your documents.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side: Tools & Features */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Humne FileManager ko alag file mein rakha hai for clean code */}
                        <FileManager user={user} setShowQR={setShowQR} />
                    </div>

                    {/* Right Side: Stats & Privacy */}
                    <div className="space-y-6">
                        {/* Plan Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Subscription Status</p>
                            <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                                <span className="text-2xl font-black text-slate-800">
                                    {user?.isPremium ? "Pro Tier" : "Free Tier"}
                                </span>
                                <p className="text-xs text-slate-500 mt-1">
                                    {user?.isPremium ? "Unlimited Access" : `${user?.generatedCount || 0} / 2 PDFs generated`}
                                </p>
                            </div>

                            {!user?.isPremium && (
                                <Button onClick={() => setShowQR(true)} className="w-full bg-gradient-to-br from-yellow-400 to-orange-500 py-7 rounded-2xl font-black shadow-lg shadow-orange-100">
                                    <Crown className="mr-2 w-5 h-5" /> UPGRADE TO PRO
                                </Button>
                            )}
                        </div>

                        {/* Privacy Card (Same as before) */}
                        <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex gap-4">
                            <div className="bg-white/10 p-2 rounded-lg h-fit"><ShieldCheck className="text-green-400 w-5 h-5" /></div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                All generations are processed in RAM and deleted immediately after download. Your privacy is our priority.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;