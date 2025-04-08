const emailServices = require("../services/emailServices");
const { criarUsuario } = require("../services/usuarioServices");

exports.requestRegistration = async (req, res) => {
  const { email } = req.body;

  if (!emailServices.verificarDominioUnivesp(email)) {
    return res.status(400).json({ message: "Formato de e-mail inválido." });
  }

  if (!emailServices.validarFormatoEmail(email)) {
    return res
      .status(400)
      .json({ message: "E-mail não pertence ao domínio da UNIVESP." });
  }

  try {
    await criarUsuario(email);
    res
      .status(200)
      .json({ message: "Link de autenticação enviado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar e-mail." });
  }
};
