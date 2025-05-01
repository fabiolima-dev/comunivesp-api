const { buscarUsuario } = require("../services/usuarioServices");

async function getUser(req, res) {
  console.log("rodando");
  const userId = req.params.id;

  const usuario = await buscarUsuario(userId);

  if (!usuario) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  return res.status(200).json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    criadoEm: usuario.criado_em,
  });
}

module.exports = { getUser };
