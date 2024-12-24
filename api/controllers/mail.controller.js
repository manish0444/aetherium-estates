import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export const sendEmail = async (req, res) => {
  const { to, from, subject, message, listingTitle, senderName } = req.body;

  // Validate email addresses
  if (!to || !from) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing recipient or sender email address' 
    });
  }

  try {
    // Email template with better formatting
    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; }
            .content { margin: 20px 0; }
            .footer { color: #6c757d; font-size: 0.9em; border-top: 1px solid #dee2e6; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Property Inquiry</h2>
              <p><strong>From:</strong> ${senderName} (${from})</p>
            </div>
            <div class="content">
              <p><strong>Regarding Property:</strong> ${listingTitle}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>This email was sent through the Property Listing Platform.</p>
              <p>Please respond directly to the sender's email: ${from}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email with verified configuration
    const mailOptions = {
      from: {
        name: 'Property Listing Platform',
        address: process.env.GMAIL_USER
      },
      to: to,
      replyTo: from,
      subject: subject || `New inquiry about: ${listingTitle}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    });
  }
}; 