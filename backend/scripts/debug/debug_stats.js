import { PrismaClient } from '@prisma/client';
import * as AlunoService from './src/services/aluno.service.js';

const prisma = new PrismaClient();

async function main() {
    console.log("Debugging Student Stats Service...");

    const stats = await AlunoService.getStats(prisma);
    console.log("Service Output:");
    console.log(JSON.stringify(stats, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
