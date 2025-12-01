import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Comparing School Counts...');

    // Current Logic (All Schools)
    const totalAll = await prisma.dados_das_escolas.count();

    // New Logic (Schools with Active Students)
    const totalWithStudents = await prisma.dados_das_escolas.count({
        where: {
            alunos_integracao: {
                some: {
                    situacao: 'ATIVO'
                }
            }
        }
    });

    console.log(`Total Schools (All): ${totalAll}`);
    console.log(`Total Schools (With Active Students): ${totalWithStudents}`);

    // Check Fundamental
    const fundAll = await prisma.dados_das_escolas.count({
        where: { ensino_fundamental: { not: 'NDA' } }
    });
    const fundWithStudents = await prisma.dados_das_escolas.count({
        where: {
            ensino_fundamental: { not: 'NDA' },
            alunos_integracao: { some: { situacao: 'ATIVO' } }
        }
    });
    console.log(`Fundamental (All): ${fundAll}`);
    console.log(`Fundamental (With Active Students): ${fundWithStudents}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
