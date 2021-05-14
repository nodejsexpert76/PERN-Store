require("dotenv").config();
const nodemailer = require("nodemailer");
const { ErrorHandler } = require("./error");
const html = require("./signup");

const url =
  process.env.NODE_ENV === "production"
    ? "https://pern-store.netlify.app"
    : "http://localhost:3000";

var transport = nodemailer.createTransport({
  port: 465,
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const signupMail = async (to, name) => {
  const message = {
    from: "pernstore.shop@gmail.com",
    to,
    subject: "Welcome to PERN Store",
    html: html(name),
  };

  try {
    await transport.sendMail(message);
  } catch (error) {
    throw new ErrorHandler(500, error.message);
  }
};

const forgotPasswordMail = async (token, email) => {
  const message = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: "Forgot Password",
    html: `<p>To reset your password, please click the link below.
      <a href="${url}/reset-password?token=${encodeURIComponent(
  token
)}&email=${email}"><br/>
      Reset Password
      </a></p>
      <p><b>Note that this link will expire in the next one(1) hour.</b></p>`,
  };

  try {
    const res = await transport.sendMail(message);
    return res;
  } catch (error) {
    throw new ErrorHandler(500, error.message);
  }
};

const resetPasswordMail = async (email) => {
  const message = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: "Password Reset Successful",
    html: "<p>Your password has been changed successfully.</p>",
  };

  try {
    await transport
      .sendMail(message);
  } catch (error) {
    throw new ErrorHandler(500, error.message);
  }
};

module.exports = {
  signupMail,
  resetPasswordMail,
  forgotPasswordMail,
};