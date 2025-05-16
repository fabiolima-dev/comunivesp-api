const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Fecha a conexão quando a aplicação for encerrada
process.on("beforeExit", async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("Erro ao desconectar do banco:", error);
  }
});

// Fecha a conexão quando receber sinais de encerramento
process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Erro ao desconectar do banco:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Erro ao desconectar do banco:", error);
    process.exit(1);
  }
});

module.exports = prisma;
