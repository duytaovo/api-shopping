var nodemailer = require("nodemailer");

const adminEmail = "voduytao3@gmail.com";
const adminPassword = "dcrgjxavvolnhdfi";
// const mailHost = process.env.MAIL_HOST;
// const mailPort = process.env.MAIL_PORT;

module.exports.sendMail = (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false, // use SSL - TLS
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
  });

  const options = {
    from: adminEmail,
    to,
    subject,
    html,
  };
  return transporter.sendMail(options); // this default return a promise
};
