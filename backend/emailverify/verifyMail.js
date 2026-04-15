import nodemailer from "nodemailer";

export const verifyMail = async (token, email) => {
    try {
        console.log("🔥 VERIFY MAIL FUNCTION CALLED");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        console.log("👉 MAIL_USER:", process.env.MAIL_USER);
        console.log("👉 MAIL_PASS LENGTH:", process.env.MAIL_PASS?.length);

        await transporter.verify();
        console.log("SMTP READY ✅");

        const link = `${process.env.FRONTEND_URL}/verify/${token}`;
        console.log("LINK:", link);

        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Verify Email",
            html: `<a href="${link}">VERIFY</a>`
        });

        console.log("MAIL SENT ✅", info.messageId);

        return true;

    } catch (err) {
        console.log("❌ FULL ERROR:", err);
        return false;
    }
};