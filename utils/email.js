const nodemailer = require('nodemailer');

console.log(process.env.GMAIL_ACCOUNT);
const NodemailerTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_ACCOUNT_PASS,
  },
});

 module.exports = NodemailerTransporter;