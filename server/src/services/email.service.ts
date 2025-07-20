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

export async function sendEmail({ to, subject, text, html }: TEmail) {
    const mailOptions = {
        from: APP_CONSTANT.COMPANY_EMAIL_USER,
        to,
        subject,
        text,
        html,
    };

    return transporter.sendMail(mailOptions);
}
