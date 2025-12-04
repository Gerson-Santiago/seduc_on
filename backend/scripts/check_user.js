
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUser(email) {
  console.log(`Checking user: ${email}`);
  const user = await prisma.usuario.findUnique({
    where: { email },
  });
  console.log(user);
}

async function main() {
  await checkUser('monitoramento@seducbertioga.com.br');
  await checkUser('gerson.santiago@seducbertioga.com.br');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
