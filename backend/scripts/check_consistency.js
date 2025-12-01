import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    console.log('Checking consistency...');

    const schools = await prisma.dados_das_escolas.findMany({ select: { cod_escola: true } });
    const schoolCodes = new Set(schools.map(s => s.cod_escola));
    console.log(`Total schools: ${schoolCodes.size}`);

    const students = await prisma.alunos_integracao_all.findMany({ select: { cod_escola: true }, distinct: ['cod_escola'] });
    const studentCodes = students.map(s => s.cod_escola).filter(c => c !== null);
    console.log(`Distinct student school codes: ${studentCodes.length}`);

    const matriculas = await prisma.consulta_matricula.findMany({ select: { cod_escola: true }, distinct: ['cod_escola'] });
    const matriculaCodes = matriculas.map(s => s.cod_escola).filter(c => c !== null);
    console.log(`Distinct matricula school codes: ${matriculaCodes.length}`);

    const missingStudents = studentCodes.filter(c => !schoolCodes.has(c));
    const missingMatriculas = matriculaCodes.filter(c => !schoolCodes.has(c));

    console.log('Orphan Student Codes (not in dados_das_escolas):', missingStudents);
    console.log('Orphan Matricula Codes (not in dados_das_escolas):', missingMatriculas);
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
