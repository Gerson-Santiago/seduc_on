import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const csvFilePath = path.join(__dirname, '../../csv/consulta_matricula.csv');

const parseIntSafe = (val) => {
    if (!val) return null;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
}

async function main() {
    console.log('Starting matricula import...');

    console.log('Truncating consulta_matricula...');
    try {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE consulta_matricula RESTART IDENTITY CASCADE;');
    } catch (e) {
        console.warn("Could not truncate consulta_matricula, proceeding...", e.message);
    }

    console.log(`Reading CSV from ${csvFilePath}...`);
    const results = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`Parsed ${results.length} rows. Inserting into DB...`);

    const batchSize = 1000;
    for (let i = 0; i < results.length; i += batchSize) {
        const batch = results.slice(i, i + batchSize);
        const data = batch.map(row => ({
            pk_serie: parseIntSafe(row.pk_serie),
            cod_escola: row.cod_escola,
            nome_escola: row.nome_escola,
            n_classe_sed: row.n_classe_sed,
            tipo_de_ensino: row.tipo_de_ensino,
            capacidade: parseIntSafe(row.capacidade),
            quant_alunos_ativos: parseIntSafe(row.quant_alunos_ativos),
            nome_serie_sed: row.nome_serie_sed,
            periodo: row.periodo,
            tipo_ensino_matricula: row.tipo_ensino_matricula,
            turma: row.turma,
            cod_turma: row.cod_turma,
            cod_escola_dup: row.cod_escola, // Mapping duplicate column if needed, or just reusing
            filtro_serie: row.filtro_serie,
            link_sala: row.link_sala,
            cod_turma_dup: row.cod_turma, // Mapping duplicate column
            id: row.id_link_sala // Mapping id_link_sala to id field based on CSV header inspection
        }));

        await prisma.consulta_matricula.createMany({
            data: data,
            skipDuplicates: false,
        });
        console.log(`Inserted rows ${i} to ${i + batch.length}`);
    }

    console.log('Matricula import complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
