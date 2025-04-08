const { PrismaClient } = require("@prisma/client");
const { addHours } = require("date-fns");
const crypto = require("crypto");
const {
  validarFormatoEmail,
  verificarDominioUnivesp,
  enviarEmail,
} = require("../services/emailServices");

const prisma = new PrismaClient();

async function criarUsuario(email) {
  if (!verificarDominioUnivesp(email)) {
    return res.status(400).json({ message: "Formato de e-mail inválido." });
  }

  if (!validarFormatoEmail(email)) {
    return res
      .status(400)
      .json({ message: "E-mail não pertence ao domínio da UNIVESP." });
  }

  const usuarioExistente = await prisma.usuarios.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    throw new Error("Email já cadastrado.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiraEm = addHours(new Date(), 1);

  const novoUsuario = await prisma.usuarios.create({
    data: {
      email,
      email_verificacao_token: token,
      email_verificacao_token_expire_em: expiraEm,
    },
  });

  await enviarEmail(email, token);

  return novoUsuario;
}

module.exports = { criarUsuario };
