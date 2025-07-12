const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Send to Admin
    await transporter.sendMail({
      from: email,
      to: process.env.GMAIL_USER,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Message Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    // Auto Response to User
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Thanks for contacting us! || Prashant Chaudhary",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out! We've received your message and will get back to you soon.</p>
        <p>Your message:</p>
        <blockquote>${message}</blockquote>
        <p><strong>– Prashant Chaudhary</strong></p>
      `,
    });

    // ✅ Redirect to frontend (URL from .env)
    res.redirect(process.env.REDIRECT_URL);

  } catch (error) {
    console.error("❌ Email sending failed:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
