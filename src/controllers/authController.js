const jwt = require("jsonwebtoken");
const {
  criarUsuario,
  verificarEmailToken,
  completarCadastro,
  buscarPorEmail,
  validarSenha,
} = require("../services/usuarioServices");

async function requestRegistration(req, res) {
  const { email } = req.body;

  await criarUsuario(email);
  return res
    .status(200)
    .json({ message: "Link de autenticação enviado com sucesso." });
}

async function verificarEmailHandler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token não informado.");
  }

  const usuario = await verificarEmailToken(token);
  res.redirect(`${process.env.FRONTEND_URL}/cadastro?id=${usuario.id}`);
}

async function finalizarCadastro(req, res) {
  const { usuarioId, nome, senha } = req.body;

  if (!usuarioId || !nome || !senha) {
    return res.status(400).json({ error: "Dados obrigatórios ausentes" });
  }

  await completarCadastro({
    usuarioId,
    nome,
    senha,
  });
  return res.status(200).json({ message: "Cadastro finalizado" });
}

async function login(req, res) {
  const { email, senha } = req.body;

  const usuario = await buscarPorEmail(email);

  if (!usuario) {
    return res.status(400).json({ error: "E-mail ou senha inválidos." });
  }

  if (!usuario.email_verificado) {
    return res.status(403).json({ error: "E-mail ainda não verificado." });
  }

  const senhaValida = await validarSenha(senha, usuario.senha);

  if (!senhaValida) {
    return res.status(400).json({ error: "E-mail ou senha inválidos" });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Login realizado com sucesso",
    token,
    user: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
  });
}

module.exports = {
  requestRegistration,
  verificarEmailHandler,
  finalizarCadastro,
  login,
};
