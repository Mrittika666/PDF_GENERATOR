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

        // Pass token and frontend URL from .env
        const htmlToSend = template({
            token: encodeURIComponent(token),
            frontendUrl: process.env.FRONTEND_URL
        });

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
                throw new Error(error)
            }
            console.log('Email sent successfully')
            console.log(info)
        })
    } catch (error) {
        console.error("Error sending verification email:", error.message)
        throw error
    }
}