// backend/prisma/import_ALUNOS.js
import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

// Importando utilitários e queries modularizados
import { converterData, converterIntSeguro, sanitizarTexto } from '../src/utils/formatters.js';
import { QUERIES_DISTRIBUICAO } from '../src/etl/queries/distribution.queries.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const caminhoArquivoCsv = path.join(__dirname, '../../csv/ALUNOS.csv');

async function main() {
  console.log('Iniciando migração de ALUNOS...');

  // 1. Truncar tabela de integração e de inconsistências
  console.log('Limpando tabelas temporárias (alunos_integracao_all, inconsistencias_importacao)...');
  try {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE alunos_integracao_all RESTART IDENTITY CASCADE;');
    // Limpar tabela de inconsistências para evitar dados antigos
    await prisma.$executeRawUnsafe('TRUNCATE TABLE inconsistencias_importacao RESTART IDENTITY CASCADE;');
  } catch (e) {
    console.warn("Aviso ao limpar tabelas (podem não existir ainda):", e.message);
  }

  // 2. Ler CSV e inserir
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

  // Inserção em lote
  const tamanhoLote = 1000;
  for (let i = 0; i < resultados.length; i += tamanhoLote) {
    const lote = resultados.slice(i, i + tamanhoLote);
    // Mapeamento dinâmico para limpar todas as strings sem redundância
    const dadosFormatados = lote.map(linha => {
      // 1. Limpa todas as propriedades do objeto original
      const objetoLimpo = {};
      for (const [chave, valor] of Object.entries(linha)) {
        objetoLimpo[chave] = sanitizarTexto(valor);
      }

      // 2. Aplica conversores específicos para campos que não são string simples ou precisam de tratamento
      // Sobrescreve as propriedades sanitizadas com os tipos corretos
      return {
        ...objetoLimpo,
        n_chamada: converterIntSeguro(linha.n_chamada),
        data_nasci: converterData(linha.data_nasci),
        data_inicial: converterData(linha.data_inicial),
        data_fim: converterData(linha.data_fim),
        data_movimentacao: converterData(linha.data_movimentacao),
      };
    });

    const VALID_TYPES = [
      "ENSINO FUNDAMENTAL DE 9 ANOS",
      "EDUCACAO INFANTIL",
      "ATENDIMENTO EDUCACIONAL ESPECIALIZADO",
      "EJA FUNDAMENTAL - ANOS INICIAIS",
      "EJA1A",
      "EDUCACAO ESPECIAL EXCLUSIVA"
    ];

    const validos = [];
    const invalidos = [];

    for (const aluno of dadosFormatados) {
      let motivo = null;

      if (!aluno.ra) {
        motivo = "RA vazio";
      } else if (!aluno.nome_aluno) { // sanitizarTexto retorna null para vazio
        motivo = "Nome do aluno vazio";
      } else if (!VALID_TYPES.includes(aluno.tipo_de_ensino)) {
        motivo = `Tipo de ensino inválido: ${aluno.tipo_de_ensino}`;
      }

      if (motivo) {
        invalidos.push({
          arquivo_origem: 'ALUNOS.csv',
          dados_json: aluno,
          motivo: motivo,
          ra: aluno.ra,
          nome_aluno: aluno.nome_aluno
        });
      } else {
        validos.push(aluno);
      }
    }

    if (validos.length > 0) {
      await prisma.alunos_integracao_all.createMany({
        data: validos,
        skipDuplicates: false,
      });
    }

    if (invalidos.length > 0) {
      console.warn(`Detectados ${invalidos.length} registros inválidos neste lote. Salvando na tabela de reparo...`);
      await prisma.inconsistencias_importacao.createMany({
        data: invalidos
      });
    }

    console.log(`Processados: ${validos.length} inseridos, ${invalidos.length} enviados para reparo (Lote ${i} a ${i + lote.length})`);
  }

  console.log('Importação para tabela de integração concluída.');

  // 3. Executar SQL de distribuição
  console.log('Executando SQL de distribuição...');

  for (const query of QUERIES_DISTRIBUICAO) {
    try {
      await prisma.$executeRawUnsafe(query);
    } catch (e) {
      console.error(`Erro ao executar query: ${query.substring(0, 50)}...`);
      console.error(e);
      throw e;
    }
  }

  console.log('Distribuição concluída.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

