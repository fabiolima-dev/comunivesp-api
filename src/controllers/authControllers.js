const { criarUsuario } = require("../services/usuarioServices");

async function requestRegistration(req, res) {
  const { email } = req.body;

  try {
    await criarUsuario(email);
    res
      .status(200)
      .json({ message: "Link de autenticação enviado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar e-mail." });
  }
}

module.exports = { requestRegistration };
