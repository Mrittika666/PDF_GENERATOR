import nodemailer from "nodemailer";

export const verifyMail = async (token, email) => {
    try {
        console.log("🔥 VERIFY MAIL FUNCTION CALLED");

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const verifyUrl = `${process.env.FRONTEND_URL}/verify/${token}`;

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Verify your email",
            html: `
                <h2>Email Verification</h2>
                <a href="${verifyUrl}">Click to Verify</a>
            `
        });

        console.log("✅ MAIL SENT");
        return true;

    } catch (error) {
        console.log("❌ MAIL ERROR:", error);
        return false;
    }
};