/*
  Warnings:

  - You are about to drop the column `cpf` on the `access_requests` table. All the data in the column will be lost.
  - You are about to drop the column `data_nascimento` on the `access_requests` table. All the data in the column will be lost.
  - You are about to drop the column `diretoria` on the `access_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "access_requests" DROP COLUMN "cpf",
DROP COLUMN "data_nascimento",
DROP COLUMN "diretoria",
ADD COLUMN     "setor" TEXT;
