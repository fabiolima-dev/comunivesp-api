/*
  Warnings:

  - You are about to drop the column `email_verificacao_token_expire_em` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "email_verificacao_token_expire_em",
ADD COLUMN     "email_verificacao_token_expira_em" TIMESTAMP(3);
