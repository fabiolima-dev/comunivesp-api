const { addHours } = require("date-fns");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const {
  validarFormatoEmail,
  verificarDominioUnivesp,
  enviarEmail,
} = require("../services/emailServices");

async function criarUsuario(email) {
  if (!validarFormatoEmail(email)) {
    throw new Error("Formato de e-mail inválido.");
  }

  if (!verificarDominioUnivesp(email)) {
    throw new Error("E-mail não pertence ao domínio da UNIVESP.");
  }

  const usuarioExistente = await prisma.usuarios.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    throw new Error("Email já cadastrado.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiraEm = addHours(new Date(), 1);

  await enviarEmail(email, token);

  await prisma.usuarios.create({
    data: {
      email,
      email_verificacao_token: token,
      email_verificacao_token_expira_em: expiraEm,
    },
  });
}

async function verificarEmailToken(token) {
  const usuario = await prisma.usuarios.findFirst({
    where: { email_verificacao_token: token },
  });

  if (!usuario) {
    throw new Error("Token inválido");
  }

  const agora = new Date();
  if (usuario.email_verificacao_token_expira_em < agora) {
    throw new Error("Token expirado");
  }

  return (usuarioAtualizado = await prisma.usuarios.update({
    where: { id: usuario.id },
    data: {
      email_verificado: true,
      email_verificacao_token: null,
      email_verificacao_token_expira_em: null,
    },
  }));
}

async function completarCadastro({ usuarioId, nome, senha }) {
  const usuario = await prisma.usuarios.findUnique({
    where: { id: usuarioId },
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  if (!usuario.email_verificado) {
    throw new Error("E-mail ainda não foi verificado");
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  return await prisma.usuarios.update({
    where: { id: usuarioId },
    data: {
      nome,
      senha: senhaHash,
    },
  });
}

async function buscarPorEmail(email) {
  return await prisma.usuarios.findUnique({
    where: { email },
  });
}

async function validarSenha(senhaEnviada, senhaHash) {
  return await bcrypt.compare(senhaEnviada, senhaHash);
}

async function buscarUsuario(id) {
  return await prisma.usuarios.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      criado_em: true,
    },
  });
}

module.exports = {
  criarUsuario,
  verificarEmailToken,
  completarCadastro,
  buscarPorEmail,
  validarSenha,
  buscarUsuario,
};
