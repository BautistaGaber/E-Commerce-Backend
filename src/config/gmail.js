import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "bautistagaber@gmail.com",
    pass: "npapechhbmcqcwpw",
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

export { transporter };
