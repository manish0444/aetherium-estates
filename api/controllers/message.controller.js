import nodemailer from 'nodemailer';

export const sendMessageToAdmin = async (req, res) => {
  try {
    const { message, userEmail, userName } = req.body;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Admin's email
      subject: `New Message from ${userName}`,
      html: `
        <h2>New Message Received</h2>
        <p><strong>From:</strong> ${userName} (${userEmail})</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
};