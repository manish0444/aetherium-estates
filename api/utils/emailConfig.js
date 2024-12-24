import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Verify environment variables
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.error('Missing required environment variables for email configuration');
  throw new Error('Missing email configuration');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD.trim() // Use trim() instead of replace
  }
});

export const sendVerificationEmail = async (to, verificationCode) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Verify your email',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your NepalNiwas Account</title>
</head>
<body style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    <div style="background: #4f46e5; padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Verify Your Email</h1>
      <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Your verification code is:</p>
    </div>
    <div style="padding: 40px 30px; background: white; text-align: center;">
      <div style="background: #f1f5f9; border: 2px dashed #94a3b8; padding: 25px; border-radius: 12px; margin: 20px 0;">
        <span style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #4f46e5;">${verificationCode}</span>
        <p style="margin: 15px 0 0 0; color: #64748b; font-size: 14px;">Code expires in 15 minutes</p>
      </div>
    </div>
  </div>
</body>
</html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Welcome to Nepal Niwas',
    html: `
      <h1>Welcome ${username}!</h1>
      <p>Thank you for joining Nepal Niwas. We're excited to have you on board.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendResetSuccessEmail = async (email) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Password Reset Successful',
    html: `
      <h1>Password Reset Successful</h1>
      <p>Your password has been successfully reset.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Reset success email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending reset success email:', error);
    throw error;
  }
}; 