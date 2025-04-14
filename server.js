require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); // Optional, for parsing JSON bodies
const nodemailer = require('nodemailer'); // Optional, for sending emails
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to enforce Content-Type for POST requests
app.use((req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(400).json({ message: 'Content-Type must be application/json' });
  }
  next();
});

// Setup CORS to allow requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Simple GET endpoint to verify the API is running
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Test endpoint that doesn't use nodemailer
app.post('/api/test', (req, res) => {
  const { name, email, message } = req.body;
  
  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  
  // Log the request data instead of sending email
  console.log('Test contact form submission:', { name, email, message });
  
  return res.status(200).json({ 
    message: 'Test successful!',
    received: { name, email, message }
  });
});

// Endpoint to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a transporter object using your email service
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider (e.g., Gmail, Outlook, etc.)
      auth: {
        user: process.env.EMAIL_USER, // Use the email from .env
        pass: process.env.EMAIL_PASS  // Use the password from .env
      }
    });

    // Email options
    const mailOptions = {
      from: email, // Sender's email (from the form)
      to: process.env.EMAIL_USER, // Your email (where you want to receive the form submissions)
      subject: `Contact Form Submission from ${name}`,
      text: `You have received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success
    return res.status(200).json({
      message: 'Message sent successfully!',
      data: { name, email, message }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      message: 'Failed to send message. Please try again later.',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
