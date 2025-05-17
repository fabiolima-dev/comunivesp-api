-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ABERTA', 'FECHADA', 'RESOLVIDA');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "ano_ingresso" INTEGER,
ADD COLUMN     "eixoId" INTEGER;

-- CreateTable
CREATE TABLE "Eixo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Eixo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duvidas" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ABERTA',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alunoId" UUID NOT NULL,
    "professorId" UUID,

    CONSTRAINT "duvidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" SERIAL NOT NULL,
    "conteudo" TEXT NOT NULL,
    "dataEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duvidaId" INTEGER NOT NULL,
    "autorId" UUID NOT NULL,
    "autorNome" TEXT NOT NULL,

    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Eixo_nome_key" ON "Eixo"("nome");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_eixoId_fkey" FOREIGN KEY ("eixoId") REFERENCES "Eixo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duvidas" ADD CONSTRAINT "duvidas_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duvidas" ADD CONSTRAINT "duvidas_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_duvidaId_fkey" FOREIGN KEY ("duvidaId") REFERENCES "duvidas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
