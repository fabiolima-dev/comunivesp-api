const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    const eixos = [
      { nome: "Gestão" },
      { nome: "Tecnologia" },
      { nome: "Produção" },
    ];

    for (const eixo of eixos) {
      await prisma.Eixo.upsert({
        where: { nome: eixo.nome },
        update: {},
        create: eixo,
      });
    }

    console.log("Eixos da UNIVESP foram populados com sucesso!");
  } catch (error) {
    console.error("Erro durante o seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Erro fatal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
