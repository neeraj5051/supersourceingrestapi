require('dotenv').config();//instatiate environment variables
const nodemailer = require("nodemailer");

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const from_email = process.env.SMTP_FROM;
const username = process.env.SMTP_USER;
const password = process.env.SMTP_PASSWORD;


const transport = nodemailer.createTransport({
  host: host,
  port: port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: username,
    pass: password,
  },
});

module.exports.sendConfirmationEmail = (_token, email, confirmationCode) => {
  console.log("Check");
  
  link = "http://localhost:3000/v1/userconfirmation/"+_token+"?verificationcode=" + confirmationCode;
  transport.sendMail({
    from: from_email,
    to: email,
    subject: "Please confirm your Email account",
    html: `Hello,<br> Please Click on the link to verify your email.<br>
      <a href="${link}">Click here to verify</a>`
  }).catch(err => console.log(err));
};