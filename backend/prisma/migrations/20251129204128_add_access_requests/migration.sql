-- CreateTable
CREATE TABLE "access_requests" (
    "id" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "registro_funcional" INTEGER NOT NULL,
    "cpf" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "cargo" TEXT,
    "diretoria" TEXT,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "solicitado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_requests_pkey" PRIMARY KEY ("id")
);
