import APP_CONSTANT from "../constants/AppConfig";
import { TEmail } from "../types/types";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: APP_CONSTANT.COMPANY_EMAIL_USER,
        pass: APP_CONSTANT.COMPANY_EMAIL_PASS,
    },
});

const testTransporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "retta.stracke@ethereal.email",
        pass: "ScNPTt38bKmGtggU4d",
    },
});

export async function sendEmail({ to, subject, text, html }: TEmail) {
    try {
        const mailOptions = {
            from: "retta.stracke@ethereal.email",
            to,
            subject,
            text,
            html,
        };
        const response = await testTransporter.sendMail(mailOptions);
        console.log("Email Sent: " + nodemailer.getTestMessageUrl(response));
        return response;
    } catch (error) {
        console.log({
            error,
        });
    }
}
