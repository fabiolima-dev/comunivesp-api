/*
  Warnings:

  - Added the required column `email_verificacao_token_expire_em` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "email_verificacao_token_expire_em" TIMESTAMP(3) NOT NULL;
