const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const { addHours } = require("date-fns");

const prisma = new PrismaClient();

async function criarUsuario(email) {
  const usuarioExistente = await prisma.usuarios.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    throw new Error("Email já cadastrado.");
  }

  const token = uuidv4();
  const expiraEm = addHours(new Date(), 1);
  const novoUsuario = await prisma.usuarios.create({
    data: {
      email,
      email_verificacao_token: token,
      email_verificacao_token_expire_em: expiraEm,
    },
  });
  return novoUsuario;
}

module.exports = { criarUsuario };
