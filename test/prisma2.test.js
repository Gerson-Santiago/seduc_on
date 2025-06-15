// test/prisma2.test.js

// Este script testa a conexão com o banco e faz uma consulta simples na tabela "Aluno"
// Para executar: node prisma.test.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔌 Conectando ao banco de dados...');

  // Substitua "aluno" pelo nome do seu model no schema.prisma, se diferente
  const alunos = await prisma.aluno.findMany({
    take: 5, // pega até 5 registros para não lotar o terminal
  });

  console.log(`✅ Encontrados ${alunos.length} alunos:`);
  console.table(alunos);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar o teste:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Desconectado do banco.');
  });
