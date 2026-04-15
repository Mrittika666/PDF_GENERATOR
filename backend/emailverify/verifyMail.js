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

        await transporter.verify();
        console.log("SMTP READY ✅");

        const link = `${process.env.FRONTEND_URL}/verify/${token}`;

        console.log("SENDING TO:", email);
        console.log("LINK:", link);

        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Verify Email",
            html: `<h2>Click below to verify</h2>
                   <a href="${link}">VERIFY</a>`
        });

        console.log("MAIL SENT ✅", info.messageId);

        return true;

    } catch (err) {
        console.log("❌ MAIL ERROR:", err.message);
        return false;
    }
};