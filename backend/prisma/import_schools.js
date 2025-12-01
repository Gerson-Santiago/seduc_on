import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const csvFilePath = path.join(__dirname, '../../csv/dados_das_escolas.csv');

const parseIntSafe = (val) => {
    if (!val) return null;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
}

async function main() {
    console.log('Starting schools import...');

    console.log('Truncating dados_das_escolas...');
    try {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE dados_das_escolas RESTART IDENTITY CASCADE;');
    } catch (e) {
        console.warn("Could not truncate dados_das_escolas, proceeding...", e.message);
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

    const batchSize = 100; // Smaller batch size due to many columns
    for (let i = 0; i < results.length; i += batchSize) {
        const batch = results.slice(i, i + batchSize);
        const data = batch.map(row => ({
            cod_escola: row.cod_escola,
            cod_ue: row.cod_ue,
            nome_escola: row.nome_escola,
            inep: row.inep,
            endereco: row.endereco,
            cep: row.cep,
            telefone: row.telefone,
            cod_sed: row.cod_sed,
            dir_email: row.dir_email,
            assist_email: row.assist_email,
            coord_email: row.coord_email,
            sec_email: row.sec_email,
            etapa: row.etapa,
            educacao_infantil: row.educacao_infantil,
            quant_turma_inf: parseIntSafe(row.quant_turma_INF),
            pre_escola: row.pre_escola,
            quant_turma_pre: parseIntSafe(row.quant_turma_PRE),
            ensino_fundamental: row.ensino_fundamental,
            quant_turma_fund: parseIntSafe(row.quant_turma_FUND),
            turmas_totais: parseIntSafe(row.turmas_totais),
            aee: row.aee,
            eee: row.eee,
            status_aee: row.status_aee,
            ano_letivo: row.ano_letivo,
            status_eja: row.status_eja,
            decreto_de_criacao: row.decreto_de_criacao,
            cnpj: row.cnpj,
            decreto_altera: row.decreto_altera,
            linkpiloto: row.linkpiloto,
            turma1: row.turma1,
            turma2: row.turma2,
            turma3: row.turma3,
            turma4: row.turma4,
            turma5: row.turma5,
            turma6: row.turma6,
            turma7: row.turma7,
            turma8: row.turma8,
            turma9: row.turma9,
            turma10: row.turma10,
            turma11: row.turma11,
            turma12: row.turma12,
            turma13: row.turma13,
            turma14: row.turma14,
            turma15: row.turma15,
            turma16: row.turma16,
            turma17: row.turma17,
            turma18: row.turma18,
            turma19: row.turma19,
            turma20: row.turma20,
            turma21: row.turma21,
            turma22: row.turma22,
            turma23: row.turma23,
            turma24: row.turma24,
            turma25: row.turma25,
            turma26: row.turma26,
            turma27: row.turma27,
            turma28: row.turma28,
            turma29: row.turma29,
            turma30: row.turma30,
            turma31: row.turma31,
            turma32: row.turma32,
            turma33: row.turma33,
            turma34: row.turma34,
            turma35: row.turma35,
            turma36: row.turma36,
            turma37: row.turma37,
            turma38: row.turma38,
            turma39: row.turma39,
            turma40: row.turma40,
        }));

        await prisma.dados_das_escolas.createMany({
            data: data,
            skipDuplicates: true, // Skip if cod_escola already exists
        });
        console.log(`Inserted rows ${i} to ${i + batch.length}`);
    }

    console.log('Schools import complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
