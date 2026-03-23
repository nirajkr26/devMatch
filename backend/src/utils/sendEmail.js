const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: '"devMatch Team" <verification@devmatch.io>',
            to: email,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

module.exports = sendEmail;
