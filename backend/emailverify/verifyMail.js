import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, email) => {
    try {
        console.log("🔥 VERIFY MAIL FUNCTION CALLED");
        console.log("📩 Recipient:", email);

        // 🔍 DEBUG ENV CHECK
        console.log("MAIL_USER:", process.env.MAIL_USER);
        console.log("MAIL_PASS length:", process.env.MAIL_PASS?.length);

        // Read template
        const emailTemplateSource = fs.readFileSync(
            path.join(__dirname, "template.hbs"),
            "utf-8"
        );

        const template = handlebars.compile(emailTemplateSource);

        const htmlToSend = template({
            token: encodeURIComponent(token),
            frontendUrl: process.env.FRONTEND_URL
        });

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
        
        try {
            await transporter.verify();
            console.log("✅ SMTP VERIFIED SUCCESS");
        } catch (err) {
            console.log("❌ SMTP VERIFY FAILED:", err.message);
            return false;
        }

        // Send mail
        const info = await transporter.sendMail({
            from: `PDF Generator <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Email Verification",
            html: htmlToSend
        });

        console.log("✅ EMAIL SENT SUCCESSFULLY");
        console.log("Message ID:", info.messageId);

        return true;

    } catch (error) {
        console.error("❌ EMAIL FAILED:");
        console.error(error.message || error);
        return false;
    }
};