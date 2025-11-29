import { PrismaClient } from '@prisma/client';
import * as AlunoService from './src/services/aluno.service.js';

const prisma = new PrismaClient();

async function main() {
    console.log("Testing Aluno Service...");

    console.log("\n--- Stats ---");
    const stats = await AlunoService.getStats(prisma);
    console.log(JSON.stringify(stats.slice(0, 3), null, 2)); // Show first 3 schools
    console.log(`Total schools found: ${stats.length}`);

    console.log("\n--- List Alunos (Page 1, Limit 5) ---");
    const list = await AlunoService.findAllAlunos(prisma, { limit: 5 });
    console.log(`Total Alunos: ${list.total}`);
    console.log(`Pages: ${list.pages}`);
    console.log("First 2 alunos:", list.alunos.slice(0, 2).map(a => ({ nome: a.nome_aluno, escola: a.nome_escola })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
