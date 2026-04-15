import nodemailer from "nodemailer";

export const verifyMail = async (token, email) => {
    try {
        console.log("📩 verifyMail function ENTERED");
        console.log("👉 MAIL_USER:", process.env.MAIL_USER);
        console.log("👉 MAIL_PASS LENGTH:", process.env.MAIL_PASS?.length);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.verify();
        console.log("SMTP READY ✅");

        const link = `${process.env.FRONTEND_URL}/verify/${token}`;
        console.log("LINK:", link);

        const info = await transporter.sendMail({
            from: `PDF App <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Verify Your Email",
            html: `<h2>Click below to verify</h2><a href="${link}">VERIFY</a>`
        });

        console.log("MAIL SENT ✅", info.messageId);

        return true;

    } catch (error) {
        console.log("MAIL ERROR ❌", error.message);
        return false;
    }
};