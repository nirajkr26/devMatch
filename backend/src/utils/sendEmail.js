const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Must be false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    family: 4, // Force IPv4 to bypass ENETUNREACH on IPv6
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    logger: true,
    debug: true
});

const sendEmail = async (email, subject, html) => {
    try {
        const mailOptions = {
            from: `"devMatch Team" <${process.env.EMAIL_USER}>`, // Must match authenticated user
            to: email,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", email);
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

module.exports = sendEmail;
