import nodemailer from "nodemailer"
import 'dotenv/config'
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import handlebars from "handlebars"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const verifyMail = async (token, email) => {
    try {
        // Read the Handlebars template
        const emailTemplateSource = fs.readFileSync(
            path.join(__dirname, "template.hbs"),
            "utf-8"
        )

        // Compile the template
        const template = handlebars.compile(emailTemplateSource)

        const htmlToSend = template({
            token: encodeURIComponent(token),
            frontendUrl: process.env.FRONTEND_URL || "https://pdf-generator-git-main-mrittikakunti070-7949s-projects.vercel.app"
        });

        console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
        console.log("TOKEN:", token);
        console.log("FINAL LINK:", `${process.env.FRONTEND_URL}/verify/${token}`);

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        // Email configuration
        const mailConfigurations = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: htmlToSend,
        }

        // Send email
        transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) {
                console.error("EMAIL ERROR:", error);
                return;
            }
            console.log('Email sent successfully')
            console.log(info)
        })
    } catch (error) {
        console.error("Error sending verification email:", error.message)
        throw error
    }
}