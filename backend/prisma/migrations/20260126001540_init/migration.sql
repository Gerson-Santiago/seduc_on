-- DropForeignKey
ALTER TABLE "logins" DROP CONSTRAINT "logins_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_criadoPorId_fkey";

-- CreateTable
CREATE TABLE "inconsistencias_importacao" (
    "id" SERIAL NOT NULL,
    "arquivo_origem" TEXT NOT NULL,
    "linha_original" INTEGER,
    "dados_json" JSONB NOT NULL,
    "motivo" TEXT NOT NULL,
    "ra" TEXT,
    "nome_aluno" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inconsistencias_importacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consulta_matricula_filtro_serie_idx" ON "consulta_matricula"("filtro_serie");
