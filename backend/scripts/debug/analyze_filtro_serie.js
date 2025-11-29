import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Analyzing filtro_serie values...");

    const series = await prisma.alunos_regular_ei_ef9.groupBy({
        by: ['filtro_serie'],
        _count: { ra: true },
        orderBy: { filtro_serie: 'asc' }
    });

    console.log("\nFiltro_serie Distribution:");
    series.forEach(s => console.log(`- "${s.filtro_serie}": ${s._count.ra}`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
