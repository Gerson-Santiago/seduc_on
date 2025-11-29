
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const series = await prisma.alunos_regular_ei_ef9.groupBy({
        by: ['filtro_serie'],
        _count: { ra: true },
    });
    console.log(series);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
