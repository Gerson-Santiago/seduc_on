/*
  Warnings:

  - You are about to drop the `alunos` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "picture" TEXT;

-- DropTable
DROP TABLE "alunos";

-- CreateTable
CREATE TABLE "alunos_integracao_all" (
    "id" SERIAL NOT NULL,
    "tipo_de_ensino" TEXT,
    "serie1" TEXT,
    "n_chamada" INTEGER,
    "nome_aluno" TEXT,
    "ra" VARCHAR(20) NOT NULL,
    "dig" VARCHAR(5),
    "uf" CHAR(2),
    "data_nasci" DATE,
    "data_inicial" DATE,
    "data_fim" DATE,
    "situacao" VARCHAR(10),
    "data_movimentacao" DATE,
    "deficiencia" TEXT,
    "endereco" TEXT,
    "pos_censo" TEXT,
    "genero" CHAR(1),
    "transporte" VARCHAR(20),
    "etnia" VARCHAR(10),
    "cod_turma" VARCHAR(20),
    "periodo" VARCHAR(20),
    "email_aluno" TEXT,
    "ra_senha" TEXT,
    "telefone" TEXT,
    "nome_responsavel" TEXT,
    "turma" TEXT,
    "filtro_serie" TEXT,
    "cod_escola" VARCHAR(20),
    "nome_escola" TEXT,
    "inep" TEXT,
    "letra_turma" TEXT,
    "letra_turno" TEXT,
    "tipo_32" TEXT,
    "turma_escola" TEXT,
    "prof1" TEXT,
    "mais_info1" TEXT,
    "mais_info2" TEXT,
    "mais_info3" TEXT,
    "mais_info4" TEXT,
    "mais_info5" TEXT,
    "mais_info6" TEXT,
    "ra_uuid" UUID,

    CONSTRAINT "alunos_integracao_all_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos_regular_ei_ef9" (
    "id" SERIAL NOT NULL,
    "tipo_de_ensino" TEXT,
    "serie1" TEXT,
    "n_chamada" INTEGER,
    "nome_aluno" TEXT,
    "ra" VARCHAR(20) NOT NULL,
    "dig" VARCHAR(5),
    "uf" CHAR(2),
    "data_nasci" DATE,
    "data_inicial" DATE,
    "data_fim" DATE,
    "situacao" VARCHAR(10),
    "data_movimentacao" DATE,
    "deficiencia" TEXT,
    "endereco" TEXT,
    "pos_censo" TEXT,
    "genero" CHAR(1),
    "transporte" VARCHAR(20),
    "etnia" VARCHAR(10),
    "cod_turma" VARCHAR(20),
    "periodo" VARCHAR(20),
    "email_aluno" TEXT,
    "ra_senha" TEXT,
    "telefone" TEXT,
    "nome_responsavel" TEXT,
    "turma" TEXT,
    "filtro_serie" TEXT,
    "cod_escola" VARCHAR(20),
    "nome_escola" TEXT,
    "inep" TEXT,
    "letra_turma" TEXT,
    "letra_turno" TEXT,
    "tipo_32" TEXT,
    "turma_escola" TEXT,
    "prof1" TEXT,
    "mais_info1" TEXT,
    "mais_info2" TEXT,
    "mais_info3" TEXT,
    "mais_info4" TEXT,
    "mais_info5" TEXT,
    "mais_info6" TEXT,
    "ra_uuid" UUID,

    CONSTRAINT "alunos_regular_ei_ef9_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos_aee" (
    "id" SERIAL NOT NULL,
    "tipo_de_ensino" TEXT,
    "serie1" TEXT,
    "n_chamada" INTEGER,
    "nome_aluno" TEXT,
    "ra" VARCHAR(20) NOT NULL,
    "dig" VARCHAR(5),
    "uf" CHAR(2),
    "data_nasci" DATE,
    "data_inicial" DATE,
    "data_fim" DATE,
    "situacao" VARCHAR(10),
    "data_movimentacao" DATE,
    "deficiencia" TEXT,
    "endereco" TEXT,
    "pos_censo" TEXT,
    "genero" CHAR(1),
    "transporte" VARCHAR(20),
    "etnia" VARCHAR(10),
    "cod_turma" VARCHAR(20),
    "periodo" VARCHAR(20),
    "email_aluno" TEXT,
    "ra_senha" TEXT,
    "telefone" TEXT,
    "nome_responsavel" TEXT,
    "turma" TEXT,
    "filtro_serie" TEXT,
    "cod_escola" VARCHAR(20),
    "nome_escola" TEXT,
    "inep" TEXT,
    "letra_turma" TEXT,
    "letra_turno" TEXT,
    "tipo_32" TEXT,
    "turma_escola" TEXT,
    "prof1" TEXT,
    "mais_info1" TEXT,
    "mais_info2" TEXT,
    "mais_info3" TEXT,
    "mais_info4" TEXT,
    "mais_info5" TEXT,
    "mais_info6" TEXT,
    "ra_uuid" UUID,

    CONSTRAINT "alunos_aee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos_eja" (
    "id" SERIAL NOT NULL,
    "tipo_de_ensino" TEXT,
    "serie1" TEXT,
    "n_chamada" INTEGER,
    "nome_aluno" TEXT,
    "ra" VARCHAR(20) NOT NULL,
    "dig" VARCHAR(5),
    "uf" CHAR(2),
    "data_nasci" DATE,
    "data_inicial" DATE,
    "data_fim" DATE,
    "situacao" VARCHAR(10),
    "data_movimentacao" DATE,
    "deficiencia" TEXT,
    "endereco" TEXT,
    "pos_censo" TEXT,
    "genero" CHAR(1),
    "transporte" VARCHAR(20),
    "etnia" VARCHAR(10),
    "cod_turma" VARCHAR(20),
    "periodo" VARCHAR(20),
    "email_aluno" TEXT,
    "ra_senha" TEXT,
    "telefone" TEXT,
    "nome_responsavel" TEXT,
    "turma" TEXT,
    "filtro_serie" TEXT,
    "cod_escola" VARCHAR(20),
    "nome_escola" TEXT,
    "inep" TEXT,
    "letra_turma" TEXT,
    "letra_turno" TEXT,
    "tipo_32" TEXT,
    "turma_escola" TEXT,
    "prof1" TEXT,
    "mais_info1" TEXT,
    "mais_info2" TEXT,
    "mais_info3" TEXT,
    "mais_info4" TEXT,
    "mais_info5" TEXT,
    "mais_info6" TEXT,
    "ra_uuid" UUID,

    CONSTRAINT "alunos_eja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alunos_regular_ei_ef9_ra_key" ON "alunos_regular_ei_ef9"("ra");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_aee_ra_key" ON "alunos_aee"("ra");
