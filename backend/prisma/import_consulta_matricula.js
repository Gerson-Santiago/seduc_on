import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const caminhoArquivoCsv = path.join(__dirname, '../../csv/consulta_matricula.csv');

const converterIntSeguro = (val) => {
    if (!val) return null;
    const processado = parseInt(val, 10);
    return isNaN(processado) ? null : processado;
}

async function main() {
    console.log('Iniciando importação de matrículas...');

    console.log('Limpando tabela consulta_matricula...');
    try {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE consulta_matricula RESTART IDENTITY CASCADE;');
    } catch (e) {
        console.warn("Não foi possível limpar consulta_matricula, continuando...", e.message);
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

    const tamanhoLote = 1000;
    for (let i = 0; i < resultados.length; i += tamanhoLote) {
        const lote = resultados.slice(i, i + tamanhoLote);
        const dadosFormatados = lote.map(linha => ({
            pk_serie: converterIntSeguro(linha.pk_serie),
            cod_escola: linha.cod_escola,
            nome_escola: linha.nome_escola,
            n_classe_sed: linha.n_classe_sed,
            tipo_de_ensino: linha.tipo_de_ensino,
            capacidade: converterIntSeguro(linha.capacidade),
            quant_alunos_ativos: converterIntSeguro(linha.quant_alunos_ativos),
            nome_serie_sed: linha.nome_serie_sed,
            periodo: linha.periodo,
            tipo_ensino_matricula: linha.tipo_ensino_matricula,
            turma: linha.turma,
            cod_turma: linha.cod_turma,
            cod_escola_dup: linha.cod_escola, // Mapeando coluna duplicada se necessário
            filtro_serie: linha.filtro_serie,
            link_sala: linha.link_sala,
            cod_turma_dup: linha.cod_turma, // Mapeando coluna duplicada
            id: linha.id_link_sala // Mapeando id_link_sala para campo id
        }));

        await prisma.consulta_matricula.createMany({
            data: dadosFormatados,
            skipDuplicates: false,
        });
        console.log(`Inseridas linhas ${i} até ${i + lote.length}`);
    }

    console.log('Importação de matrículas concluída.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
