import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const caminhoArquivoCsv = path.join(__dirname, '../../csv/dados_das_escolas.csv');

const converterIntSeguro = (val) => {
    if (!val) return null;
    const processado = parseInt(val, 10);
    return isNaN(processado) ? null : processado;
}

async function main() {
    console.log('Iniciando importação de escolas...');

    console.log('Limpando tabela dados_das_escolas...');
    try {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE dados_das_escolas RESTART IDENTITY CASCADE;');
    } catch (e) {
        console.warn("Não foi possível limpar dados_das_escolas, continuando...", e.message);
    }

    console.log(`Lendo CSV de ${caminhoArquivoCsv}...`);
    const resultados = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream(caminhoArquivoCsv)
            .pipe(csv())
            .on('data', (dados) => resultados.push(dados))
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`Lidas ${resultados.length} linhas. Inserindo no Banco de Dados...`);

    const tamanhoLote = 100; // Lote menor devido a muitas colunas
    for (let i = 0; i < resultados.length; i += tamanhoLote) {
        const lote = resultados.slice(i, i + tamanhoLote);
        const dadosFormatados = lote.map(linha => ({
            cod_escola: linha.cod_escola,
            cod_ue: linha.cod_ue,
            nome_escola: linha.nome_escola,
            inep: linha.inep,
            endereco: linha.endereco,
            cep: linha.cep,
            telefone: linha.telefone,
            cod_sed: linha.cod_sed,
            dir_email: linha.dir_email,
            assist_email: linha.assist_email,
            coord_email: linha.coord_email,
            sec_email: linha.sec_email,
            etapa: linha.etapa,
            educacao_infantil: linha.educacao_infantil,
            quant_turma_inf: converterIntSeguro(linha.quant_turma_INF),
            pre_escola: linha.pre_escola,
            quant_turma_pre: converterIntSeguro(linha.quant_turma_PRE),
            ensino_fundamental: linha.ensino_fundamental,
            quant_turma_fund: converterIntSeguro(linha.quant_turma_FUND),
            turmas_totais: converterIntSeguro(linha.turmas_totais),
            aee: linha.aee,
            eee: linha.eee,
            status_aee: linha.status_aee,
            ano_letivo: linha.ano_letivo,
            status_eja: linha.status_eja,
            decreto_de_criacao: linha.decreto_de_criacao,
            cnpj: linha.cnpj,
            decreto_altera: linha.decreto_altera,
            linkpiloto: linha.linkpiloto,
            turma1: linha.turma1,
            turma2: linha.turma2,
            turma3: linha.turma3,
            turma4: linha.turma4,
            turma5: linha.turma5,
            turma6: linha.turma6,
            turma7: linha.turma7,
            turma8: linha.turma8,
            turma9: linha.turma9,
            turma10: linha.turma10,
            turma11: linha.turma11,
            turma12: linha.turma12,
            turma13: linha.turma13,
            turma14: linha.turma14,
            turma15: linha.turma15,
            turma16: linha.turma16,
            turma17: linha.turma17,
            turma18: linha.turma18,
            turma19: linha.turma19,
            turma20: linha.turma20,
            turma21: linha.turma21,
            turma22: linha.turma22,
            turma23: linha.turma23,
            turma24: linha.turma24,
            turma25: linha.turma25,
            turma26: linha.turma26,
            turma27: linha.turma27,
            turma28: linha.turma28,
            turma29: linha.turma29,
            turma30: linha.turma30,
            turma31: linha.turma31,
            turma32: linha.turma32,
            turma33: linha.turma33,
            turma34: linha.turma34,
            turma35: linha.turma35,
            turma36: linha.turma36,
            turma37: linha.turma37,
            turma38: linha.turma38,
            turma39: linha.turma39,
            turma40: linha.turma40,
        }));

        await prisma.dados_das_escolas.createMany({
            data: dadosFormatados,
            skipDuplicates: true, // Pular se cod_escola já existir
        });
        console.log(`Inseridas linhas ${i} até ${i + lote.length}`);
    }

    console.log('Importação de escolas concluída.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
