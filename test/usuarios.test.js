import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const usuarios = await prisma.usuario.findMany({
    take: 10,
  });
  console.log('— 10 usuários de exemplo —');
  console.table(usuarios);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
