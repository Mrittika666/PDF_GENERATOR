import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, email) => {
    try {
        console.log("🔥 VERIFY MAIL TRIGGERED");

        const emailTemplateSource = fs.readFileSync(
            path.join(__dirname, "template.hbs"),
            "utf-8"
        );

        const template = handlebars.compile(emailTemplateSource);

        const htmlToSend = template({
            token: encodeURIComponent(token),
            frontendUrl: process.env.FRONTEND_URL
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `PDF Generator <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Email Verification",
            html: htmlToSend
        });

        console.log("✅ EMAIL SENT SUCCESSFULLY:", info.messageId);

        return true; // IMPORTANT
    } catch (error) {
        console.log("❌ EMAIL ERROR:", error.message);
        return false;
    }
};