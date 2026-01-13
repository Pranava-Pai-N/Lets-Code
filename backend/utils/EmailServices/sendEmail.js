import nodemailer from 'nodemailer';
import ExpressError from '../expressError.js';
import dotenv from "dotenv"

dotenv.config();


const sendEmail = async (toEmail, subject, emailBody) => {
    try {
        const transporter = nodemailer.createTransport({
            host : "smtp.gmail.com",
            port : 587,
            secure : false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const emailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: subject,
            html: emailBody,
        };

        const response = await transporter.sendMail(emailOptions);
        return response;

    } catch (error) {
        console.error("Failed to send email:", error);
        throw new ExpressError(400, "Error sending Email ...")
    }
}

export default sendEmail;