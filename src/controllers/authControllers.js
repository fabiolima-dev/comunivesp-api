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

  try {
    await criarUsuario(email);
    res
      .status(200)
      .json({ message: "Link de autenticação enviado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar e-mail." });
  }
}

async function verificarEmailHandler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token não informado.");
  }

  try {
    const usuario = await verificarEmailToken(token);
    res.redirect(`http://localhost:5173/cadastro?id=${usuario.id}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function finalizarCadastro(req, res) {
  try {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Erro interno" });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  try {
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
  } catch (err) {
    console.error("Erro no login: ", err);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
}

module.exports = {
  requestRegistration,
  verificarEmailHandler,
  finalizarCadastro,
  login,
};
