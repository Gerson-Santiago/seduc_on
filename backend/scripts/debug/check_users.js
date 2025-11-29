import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Checking users in database...");
    const users = await prisma.usuario.findMany();
    console.log(`Total users found: ${users.length}`);
    users.forEach(u => console.log(`- ${u.email} (${u.perfil})`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
