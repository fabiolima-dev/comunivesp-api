const { buscarUsuario } = require("../services/usuarioServices");
const prisma = require("../lib/prisma");

async function getUser(req, res) {
  console.log("rodando");
  const userId = req.params.id;

  const usuario = await buscarUsuario(userId);

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  return res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    criadoEm: usuario.criado_em,
  });
}

async function listarEixos(req, res) {
  const eixos = await prisma.eixo.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  return res.json(eixos);
}

async function atualizarUsuario(req, res) {
  const userId = req.params.id;
  const { nome, eixoId, anoIngresso } = req.body;

  // Verifica se o usuário está tentando editar seus próprios dados
  if (userId !== req.usuarioId) {
    throw new Error("Não autorizado a editar dados de outro usuário.");
  }

  const usuario = await prisma.usuarios.findUnique({
    where: { id: userId },
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  // Converte eixoId e anoIngresso para número se existirem
  const eixoIdNumber = eixoId ? Number(eixoId) : null;
  const anoIngressoNumber = anoIngresso ? Number(anoIngresso) : null;

  const usuarioAtualizado = await prisma.usuarios.update({
    where: { id: userId },
    data: {
      nome,
      eixoId: eixoIdNumber,
      ano_ingresso: anoIngressoNumber,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      eixoId: true,
      ano_ingresso: true,
      criado_em: true,
    },
  });

  return res.json(usuarioAtualizado);
}

module.exports = { getUser, listarEixos, atualizarUsuario };
