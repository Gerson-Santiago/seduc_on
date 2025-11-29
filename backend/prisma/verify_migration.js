import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Verifying migration results...");
    const countAll = await prisma.alunos_integracao_all.count();
    const countRegular = await prisma.alunos_regular_ei_ef9.count();
    const countAee = await prisma.alunos_aee.count();
    const countEja = await prisma.alunos_eja.count();

    console.log(`----------------------------------------`);
    console.log(`alunos_integracao_all (Total): ${countAll}`);
    console.log(`alunos_regular_ei_ef9 (Regular): ${countRegular}`);
    console.log(`alunos_aee (AEE): ${countAee}`);
    console.log(`alunos_eja (EJA): ${countEja}`);
    console.log(`----------------------------------------`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
