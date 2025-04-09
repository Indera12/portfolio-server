const express = require('express');
const bodyParser = require('body-parser'); // Optional, for parsing JSON bodies
const nodemailer = require('nodemailer'); // Optional, for sending emails
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Endpoint to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Optional: Set up nodemailer to send an email
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
      user: 'inderabharati@gmail.com', // Your email
      pass: 'mtlm srrs zgok xbqh', // Your email password
    },
  });

  const mailOptions = {
    from: email,
    to: 'inderabharati@gmail.com', // Your email to receive messages
    subject: `Contact Form Submission from ${name}`,
    text: message,
  };

  try {
    // Send email (optional)
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
