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
        console.log("📩 VERIFY MAIL TRIGGERED");

        // Read template
        const emailTemplateSource = fs.readFileSync(
            path.join(__dirname, "template.hbs"),
            "utf-8"
        );

        // Compile template
        const template = handlebars.compile(emailTemplateSource);

        const htmlToSend = template({
            token: encodeURIComponent(token),
            frontendUrl:
                process.env.FRONTEND_URL ||
                "https://pdf-generator-teal.vercel.app"
        });

        console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
        console.log("RECIPIENT EMAIL:", email);

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // IMPORTANT: verify SMTP before sending (debug help)
        await transporter.verify();
        console.log("✅ SMTP CONNECTION SUCCESS");

        // Mail options
        const mailConfigurations = {
            from: `PDF Generator <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Email Verification",
            html: htmlToSend
        };

        // SEND MAIL (ASYNC FIX)
        const info = await transporter.sendMail(mailConfigurations);

        console.log("✅ EMAIL SENT SUCCESSFULLY");
        console.log("Message ID:", info.messageId);

        return true;
    } catch (error) {
        console.error("❌ EMAIL SENDING FAILED:");
        console.error(error.message || error);

        // IMPORTANT: don't crash server
        return false;
    }
};