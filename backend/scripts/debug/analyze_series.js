import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Analyzing serie1 values...");

    const series = await prisma.alunos_regular_ei_ef9.groupBy({
        by: ['serie1'],
        _count: { ra: true },
        orderBy: { serie1: 'asc' }
    });

    console.log("\nSerie1 Distribution:");
    series.forEach(s => console.log(`- "${s.serie1}": ${s._count.ra}`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
