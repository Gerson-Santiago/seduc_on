// test-prisma.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1) Buscar todos os alunos, limitando a 10 registros de exemplo
  const alunos = await prisma.alunos.findMany({
    take: 10,
    select: {
      ra: true,
      nome_aluno: true,
      cod_turma: true,
      data_nasci: true,
    },
  });
  console.log('— 10 alunos de exemplo —');
  console.table(alunos);

  // 2) Buscar as primeiras 5 escolas
  const escolas = await prisma.dados_das_escolas.findMany({
    take: 5,
    select: {
      cod_escola: true,
      nome_escola: true,
      telefone: true,
    },
  });
  console.log('— 5 escolas de exemplo —');
  console.table(escolas);

  // 3) Buscar 5 registros de consulta_matricula
  const matriculas = await prisma.consulta_matricula.findMany({
    take: 5,
    select: {
      pk_serie: true,
      cod_escola: true,
      tipo_de_ensino: true,
      link_sala: true,
      id_new: true,         // sua PK nova
    },
  });
  console.log('— 5 consultas de matrícula —');
  console.table(matriculas);
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
