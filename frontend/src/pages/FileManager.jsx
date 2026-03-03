import React, { useState, useEffect } from "react";
import { Image, FileText, Crown, Presentation, TableProperties, PenTool, Paintbrush, Trash2, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import axios from "axios";
import { toast } from "sonner";

// Reuseable Card Component
const FeatureCard = ({ icon: Icon, title, desc, onClick, locked }) => (
    <div
        onClick={onClick}
        className={`p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative`}
    >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${locked ? 'bg-slate-50 text-slate-400' : 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors'}`}>
            <Icon size={24} />
        </div>
        <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

// FileManager.jsx
const FileManager = ({ user }) => {
    const [files, setFiles] = useState([]);

    // --- YE WALA SAFETY CHECK ADD KAREIN ---
    if (!user || !user.email) {
        return (
            <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-500 italic">Syncing your profile data...</p>
            </div>
        );
    }

    const fetchFiles = async () => {
        // Agar email nahi hai toh API call hi mat karo
        if (!user?.email) return;

        try {
            const res = await axios.get(`http://localhost:3000/user/get-files/${user.email}`);
            if (res.data.success) {
                setFiles(res.data.files);
            }
        } catch (err) {
            console.error("Error fetching files:", err);
        }
    };
    // ... baki functions (delete/save) mein bhi user?.email use karein

    // FileManager.jsx (Line 45)
    // FileManager.jsx (Line 45 ke aas-paas replace karein)
    useEffect(() => {
        if (user?.email) {
            fetchFiles();
        }
    }, [user?.email]); // Jab user mil jaye tab files fetch ho // Jab bhi user ka email update ho, tabhi chale

    // Image to PDF Logic (CREATE)
    // Image to PDF Logic (Updated with User-defined Name)
    const handleImgToPdf = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.accept = "image/*";
        input.onchange = async (e) => {
            const selectedFiles = Array.from(e.target.files);
            if (selectedFiles.length === 0) return;

            // --- NAAM PUCHNE WALA LOGIC ---
            let customName = prompt("Enter a name for your PDF:", `Generated_${Date.now()}`);

            // Agar user cancel kar de ya khali chhode toh default name use karein
            if (!customName) customName = `Generated_${Date.now()}`;

            // Ensure name ends with .pdf
            const finalFileName = customName.toLowerCase().endsWith(".pdf")
                ? customName
                : `${customName}.pdf`;

            const doc = new jsPDF();
            toast.info("Generating PDF...");

            for (let i = 0; i < selectedFiles.length; i++) {
                const imgData = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = (ev) => resolve(ev.target.result);
                    reader.readAsDataURL(selectedFiles[i]);
                });
                if (i > 0) doc.addPage();
                doc.addImage(imgData, "JPEG", 10, 10, 190, 0);
            }

            // 1. Download with user's chosen name
            doc.save(finalFileName);

            // 2. Save to MongoDB with user's chosen name
            try {
                await axios.post("http://localhost:3000/user/save-file", {
                    email: user.email,
                    fileName: finalFileName // Purane fileName variable ki jagah ye use karein
                });
                fetchFiles();
                toast.success(`'${finalFileName}' saved to history!`);
            } catch (err) {
                toast.error("Failed to save file name to database.");
            }
        };
        input.click();
    };

    // Delete Logic (DELETE)
    const handleDelete = async (fileId) => {
        try {
            const res = // handleDelete function ke andar
                await axios.post("http://localhost:3000/user/delete-file", {
                    email: user.email,
                    fileId: fileId

                });
            if (res.data.success) {
                setFiles(res.data.files);
                toast.success("File deleted");
            }
        } catch (err) { toast.error("Delete failed"); }
    };

    return (
        <div className="space-y-12">
            {/* --- FREE PLAN TOOLS --- */}
            <section>
                <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                    Free Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard icon={Image} title="Image to PDF" desc="Convert JPG, PNG to single PDF" onClick={handleImgToPdf} />
                    <FeatureCard icon={FileText} title="Text to PDF" desc="Type text and save as PDF" onClick={() => toast("Text tool coming soon!")} />
                </div>
            </section>

            {/* --- PREMIUM PLAN TOOLS --- */}
            <section className="relative">
                <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                    Pro Tools <Crown className="w-5 h-5 text-orange-400" />
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                    {!user.isPremium && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-orange-100 cursor-pointer">
                            <Crown className="w-12 h-12 text-orange-400 mb-2" />
                            <p className="text-slate-700 font-black text-lg">Upgrade to Pro to Unlock</p>
                            <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition">Get Premium</button>
                        </div>
                    )}
                    <FeatureCard icon={Presentation} title="PPT to PDF" desc="PowerPoint to professional PDF" locked />
                    <FeatureCard icon={TableProperties} title="Excel to PDF" desc="XLSX sheets to clean PDF tables" locked />
                    <FeatureCard icon={PenTool} title="PDF Page Editor" desc="Rotate, delete, reorder pages" locked />
                </div>
            </section>

            {/* --- RECENT SAVED FILES --- */}
            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-700 mb-6">Recent Documents</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {files.map((file) => (
                        <div key={file._id} className="group bg-slate-50 p-4 rounded-3xl flex flex-col items-center relative hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-3">
                                <FileText size={28} />
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 truncate w-full text-center px-2">{file.fileName}</p>
                            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-3xl">
                                <button onClick={() => handleDelete(file._id)} className="p-2 bg-red-500 text-white rounded-full"><Trash2 size={16} /></button>
                                <button className="p-2 bg-blue-500 text-white rounded-full"><Download size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default FileManager;