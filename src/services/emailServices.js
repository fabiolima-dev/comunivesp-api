const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../../.env" });

function verificarDominioUnivesp(email) {
  const dominio = email.split("@")[1];
  return dominio === "univesp.br" || "aluno.univesp.br";
}

function validarFormatoEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

async function enviarEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const link = `http://localhost:3000/verificar-email?token=${token}`;

  const mailOptions = {
    from: `Comunivesp ${process.env.EMAIL_USER}`,
    to: email,
    subject: "Verifique seu e-mail",
    html: `
      <h2>Confirme seu e-mail</h2>
      <p>Clique no link abaixo para verificar seu e-mail:</p>
      <a href="${link}">${link}</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado:", info.response);
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    throw new Error("Falha ao enviar e-mail de verificação.");
  }
}

module.exports = { enviarEmail, validarFormatoEmail, verificarDominioUnivesp };
