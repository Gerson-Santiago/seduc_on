
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const stats = await prisma.alunos_regular_ei_ef9.groupBy({
        by: ['filtro_serie', 'situacao'],
        _count: { ra: true },
        orderBy: { filtro_serie: 'asc' },
    });
    console.log(JSON.stringify(stats, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
