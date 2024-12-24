// Backend code for reference (needs to be implemented)
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, message, listingId, landlordId } = req.body;

    // Create transporter with your email service credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
      // You can also use HTML
      html: `
        <h3>New message regarding: ${subject}</h3>
        <p>${message}</p>
        <p>Listing ID: ${listingId}</p>
      `,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;