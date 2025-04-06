const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config({ path: "../../.env" });

exports.verificarDominioUnivesp = (email) => {
  const dominio = email.split("@")[1];
  return dominio === "univesp.br" || "aluno.univesp.br";
};

exports.validarFormatoEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

exports.enviarEmail = (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL_PASSWORD,
    to: email,
    subject: "assunto",
    text: "corpo",
    html: "<p>corpo do email em html</p>",
  };

  const token = crypto.randomBytes(32).toString("hex");

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Erro ao enviar o e-mail: ", error);
    }
    console.log("E-mail enviado:", info.response);
  });
};
