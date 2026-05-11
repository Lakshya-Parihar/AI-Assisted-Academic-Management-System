import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure the transporter with your App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g., tngxcrazy04@gmail.com
    pass: process.env.EMAIL_PASS, // Your 16-character App Password (no spaces)
  },
});

/**
 * Reusable function to send beautiful HTML emails
 */
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"AIAAMS Faculty Portal" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(",") : to, // Handles one or multiple emails
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email dispatched successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return false;
  }
};
/* ecvc awob oqdd byuq */