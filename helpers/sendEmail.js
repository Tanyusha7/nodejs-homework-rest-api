const nodemailer = require("nodemailer");
require("dotenv").config();

const { HttpError } = require("./HttpError");
const { META_PASSWORD } = process.env;

const mailConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  type: "OAuth2",
  auth: {
    user: "tetderenko@ukr.net",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(mailConfig);

const sendEmail = async (data) => {
  try {
    const email = {
      from: "tetderenko@ukr.net",
      ...data,
    };

    await transporter.sendMail(email);
    console.log("Email sent success");
    return true;
  } catch (err) {
    throw new Error(err.response);
    // return console.log(err);
  }
};

module.exports = sendEmail;
