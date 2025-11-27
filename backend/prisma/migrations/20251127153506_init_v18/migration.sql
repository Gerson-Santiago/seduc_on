-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('superadmin', 'admin', 'comum');

-- CreateTable
CREATE TABLE "alunos" (
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
    "transporte_15" VARCHAR(20),
    "genero" CHAR(1),
    "bolsa_familia" CHAR(1),
    "etnia" CHAR(1),
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
    "info1" CHAR(1),
    "info2" CHAR(1),
    "info3" CHAR(1),
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

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consulta_matricula" (
    "pk_serie" INTEGER,
    "cod_escola" TEXT,
    "nome_escola" TEXT,
    "n_classe_sed" TEXT,
    "tipo_de_ensino" TEXT,
    "capacidade" INTEGER,
    "quant_alunos_ativos" INTEGER,
    "nome_serie_sed" TEXT,
    "periodo" TEXT,
    "tipo_ensino_matricula" TEXT,
    "turma" TEXT,
    "cod_turma" TEXT,
    "cod_escola_dup" TEXT,
    "filtro_serie" TEXT,
    "link_sala" TEXT,
    "cod_turma_dup" TEXT,
    "id" TEXT,
    "id_new" SERIAL NOT NULL,

    CONSTRAINT "consulta_matricula_pkey" PRIMARY KEY ("id_new")
);

-- CreateTable
CREATE TABLE "dados_das_escolas" (
    "cod_escola" TEXT NOT NULL,
    "cod_ue" TEXT,
    "nome_escola" TEXT,
    "inep" TEXT,
    "endereco" TEXT,
    "cep" TEXT,
    "telefone" TEXT,
    "cod_sed" TEXT,
    "dir_email" TEXT,
    "assist_email" TEXT,
    "coord_email" TEXT,
    "sec_email" TEXT,
    "etapa" TEXT,
    "educacao_infantil" TEXT,
    "quant_turma_inf" INTEGER,
    "pre_escola" TEXT,
    "quant_turma_pre" INTEGER,
    "ensino_fundamental" TEXT,
    "quant_turma_fund" INTEGER,
    "turmas_totais" INTEGER,
    "aee" TEXT,
    "eee" TEXT,
    "status_aee" TEXT,
    "ano_letivo" TEXT,
    "status_eja" TEXT,
    "decreto_de_criacao" TEXT,
    "cnpj" TEXT,
    "decreto_altera" TEXT,
    "linkpiloto" TEXT,
    "turma1" TEXT,
    "turma2" TEXT,
    "turma3" TEXT,
    "turma4" TEXT,
    "turma5" TEXT,
    "turma6" TEXT,
    "turma7" TEXT,
    "turma8" TEXT,
    "turma9" TEXT,
    "turma10" TEXT,
    "turma11" TEXT,
    "turma12" TEXT,
    "turma13" TEXT,
    "turma14" TEXT,
    "turma15" TEXT,
    "turma16" TEXT,
    "turma17" TEXT,
    "turma18" TEXT,
    "turma19" TEXT,
    "turma20" TEXT,
    "turma21" TEXT,
    "turma22" TEXT,
    "turma23" TEXT,
    "turma24" TEXT,
    "turma25" TEXT,
    "turma26" TEXT,
    "turma27" TEXT,
    "turma28" TEXT,
    "turma29" TEXT,
    "turma30" TEXT,
    "turma31" TEXT,
    "turma32" TEXT,
    "turma33" TEXT,
    "turma34" TEXT,
    "turma35" TEXT,
    "turma36" TEXT,
    "turma37" TEXT,
    "turma38" TEXT,
    "turma39" TEXT,
    "turma40" TEXT,

    CONSTRAINT "dados_das_escolas_pkey" PRIMARY KEY ("cod_escola")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL,
    "nome" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoPorId" INTEGER,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logins" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logins" ADD CONSTRAINT "logins_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
