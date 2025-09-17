"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, html, qrCodeData) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
        // prepare attachments if qrCodeData exists
        const attachments = qrCodeData
            ? [
                {
                    filename: "ticket.png",
                    content: Buffer.from(qrCodeData.split(",")[1], "base64"),
                    cid: "ticketqr", // reference in HTML with <img src="cid:ticketqr">
                },
            ]
            : [];
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject,
            html,
            attachments,
        });
        console.log("[Email] Email sent successfully:", info.messageId);
    }
    catch (err) {
        console.error("[Email] Failed to send email:", err.message);
        throw err;
    }
};
exports.sendEmail = sendEmail;
