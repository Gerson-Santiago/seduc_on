import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const csvFilePath = path.join(__dirname, '../../csv/ALUNOS.csv');
const sqlFilePath = path.join(__dirname, '../../distribute_data.sql');

// Helper to parse DD/MM/YYYY to Date
const parseDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') return null;
    const parts = dateStr.trim().split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (year < 1900 || year > 2100) return null; // Sanity check

    // new Date(year, monthIndex, day) - month is 0-indexed
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) return null;
    return date;
};

// Helper to parse integer safely
const parseIntSafe = (val) => {
    if (!val) return null;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
}

async function main() {
    console.log('Starting migration...');

    // 1. Truncate integration table
    console.log('Truncating alunos_integracao_all...');
    try {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE alunos_integracao_all RESTART IDENTITY CASCADE;');
    } catch (e) {
        console.warn("Could not truncate alunos_integracao_all (might not exist yet or other error), proceeding...", e.message);
    }

    // 2. Read CSV and insert
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

    // Batch insert
    const batchSize = 1000;
    for (let i = 0; i < results.length; i += batchSize) {
        const batch = results.slice(i, i + batchSize);
        const data = batch.map(row => ({
            tipo_de_ensino: row.tipo_de_ensino,
            serie1: row.serie1,
            n_chamada: parseIntSafe(row.n_chamada),
            nome_aluno: row.nome_aluno,
            ra: row.ra,
            dig: row.dig,
            uf: row.uf,
            data_nasci: parseDate(row.data_nasci),
            data_inicial: parseDate(row.data_inicial),
            data_fim: parseDate(row.data_fim),
            situacao: row.situacao,
            data_movimentacao: parseDate(row.data_movimentacao),
            deficiencia: row.deficiencia,
            endereco: row.endereco,
            pos_censo: row.pos_censo,
            genero: row.genero,
            transporte: row.transporte,
            etnia: row.etnia,
            cod_turma: row.cod_turma,
            periodo: row.periodo,
            email_aluno: row.email_aluno,
            ra_senha: row.ra_senha,
            telefone: row.telefone,
            nome_responsavel: row.nome_responsavel,
            turma: row.turma,
            filtro_serie: row.filtro_serie,
            cod_escola: row.cod_escola,
            nome_escola: row.nome_escola,
            inep: row.inep,
            letra_turma: row.letra_turma,
            letra_turno: row.letra_turno,
            tipo_32: row.tipo_32,
            turma_escola: row.turma_escola,
            prof1: row.prof1,
            mais_info1: row.mais_info1,
            mais_info2: row.mais_info2,
            mais_info3: row.mais_info3,
            mais_info4: row.mais_info4,
            mais_info5: row.mais_info5,
            mais_info6: row.mais_info6,
        }));

        await prisma.alunos_integracao_all.createMany({
            data: data,
            skipDuplicates: false,
        });
        console.log(`Inserted rows ${i} to ${i + batch.length}`);
    }

    console.log('Import to integration table complete.');

    // 3. Execute distribution SQL
    console.log('Executing distribution SQL...');

    const queries = [
        `TRUNCATE TABLE alunos_regular_ei_ef9 RESTART IDENTITY;`,
        `TRUNCATE TABLE alunos_aee RESTART IDENTITY;`,
        `TRUNCATE TABLE alunos_eja RESTART IDENTITY;`,

        // 1. Povoar alunos_regular_ei_ef9
        `INSERT INTO alunos_regular_ei_ef9 (
      tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
      data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
      pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
      ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
      nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
      mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
    )
    SELECT DISTINCT ON (ra)
      tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
      data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
      pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
      ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
      nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
      mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
    FROM alunos_integracao_all
    WHERE 
      tipo_de_ensino IN ('ENSINO FUNDAMENTAL DE 9 ANOS', 'EDUCACAO INFANTIL')
      AND situacao = 'ATIVO'
    ORDER BY ra, data_movimentacao DESC;`,

        // 2. Povoar alunos_aee
        `INSERT INTO alunos_aee (
      tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
      data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
      pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
      ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
      nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
      mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
    )
    SELECT DISTINCT ON (ra)
      tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
      data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
      pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
      ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
      nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
      mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
    FROM alunos_integracao_all
    WHERE 
      tipo_de_ensino = 'ATENDIMENTO EDUCACIONAL ESPECIALIZADO'
      AND situacao = 'ATIVO'
    ORDER BY ra, data_movimentacao DESC;`,

        // 3. Povoar alunos_eja
        `INSERT INTO alunos_eja (
      tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
      data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
      pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
      ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
      nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
      mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
    )
    SELECT 
      tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
      data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
      pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
      ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
      nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
      mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
    FROM alunos_integracao_all
    WHERE 
      tipo_de_ensino IN ('EJA1A', 'EJA FUNDAMENTAL - ANOS INICIAIS')
      AND situacao = 'ATIVO';`
    ];

    for (const query of queries) {
        try {
            await prisma.$executeRawUnsafe(query);
        } catch (e) {
            console.error(`Error executing query: ${query.substring(0, 50)}...`);
            console.error(e);
            throw e;
        }
    }

    console.log('Distribution complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
