import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying relations and inconsistencies...');

    // 1. Check Students with School
    const studentWithSchool = await prisma.alunos_integracao_all.findFirst({
        where: { escola: { isNot: null } },
        include: { escola: true }
    });
    console.log('Student with School found:', !!studentWithSchool);
    if (studentWithSchool) {
        console.log(`- Student: ${studentWithSchool.nome_aluno}`);
        console.log(`- School: ${studentWithSchool.escola.nome_escola}`);
    }

    // 2. Check Matriculas with School
    const matriculaWithSchool = await prisma.consulta_matricula.findFirst({
        where: { escola: { isNot: null } },
        include: { escola: true }
    });
    console.log('Matricula with School found:', !!matriculaWithSchool);
    if (matriculaWithSchool) {
        console.log(`- Matricula ID: ${matriculaWithSchool.id_new}`);
        console.log(`- School: ${matriculaWithSchool.escola.nome_escola}`);
    }

    // 3. Find Inconsistencies (Orphans) using Relation
    // Note: Since relationMode = "prisma", we can query for where escola is null but cod_escola is not null
    const orphanMatriculas = await prisma.consulta_matricula.findMany({
        where: {
            escola: { is: null },
            cod_escola: { not: null }
        },
        select: { cod_escola: true, nome_escola: true },
        distinct: ['cod_escola']
    });

    console.log('Orphan Matriculas (Inconsistencies):');
    orphanMatriculas.forEach(m => {
        console.log(`- Code: "${m.cod_escola}", Name: "${m.nome_escola}"`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
