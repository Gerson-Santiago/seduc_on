/*
  Warnings:

  - Changed the type of `registro_funcional` on the `access_requests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "access_requests" ADD COLUMN     "contador_registro_funcional" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "registro_funcional",
ADD COLUMN     "registro_funcional" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "cargo" TEXT,
ADD COLUMN     "contador_registro_funcional" INTEGER,
ADD COLUMN     "registro_funcional" INTEGER,
ADD COLUMN     "setor" TEXT;
