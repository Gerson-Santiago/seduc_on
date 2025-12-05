// backend/prisma/import_ALUNOS.js
import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const caminhoArquivoCsv = path.join(__dirname, '../../csv/ALUNOS.csv');

// Helper para converter DD/MM/YYYY para Date
const converterData = (dataStr) => {
  if (!dataStr || typeof dataStr !== 'string' || dataStr.trim() === '') return null;
  const partes = dataStr.trim().split('/');
  if (partes.length !== 3) return null;

  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10);
  const ano = parseInt(partes[2], 10);

  if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;
  if (ano < 1900 || ano > 2100) return null; // Verificação de sanidade

  // new Date(ano, mesIndex, dia) - mês é indexado em 0
  const data = new Date(ano, mes - 1, dia);

  if (isNaN(data.getTime())) return null;
  return data;
};

// Helper para converter inteiro com segurança
const converterIntSeguro = (val) => {
  if (!val) return null;
  const processado = parseInt(val, 10);
  return isNaN(processado) ? null : processado;
}

async function main() {
  console.log('Iniciando migração de ALUNOS...');

  // 1. Truncar tabela de integração
  console.log('Limpando tabela alunos_integracao_all...');
  try {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE alunos_integracao_all RESTART IDENTITY CASCADE;');
  } catch (e) {
    console.warn("Não foi possível limpar alunos_integracao_all (pode não existir ainda ou outro erro), continuando...", e.message);
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
    const dadosFormatados = lote.map(linha => ({
      tipo_de_ensino: linha.tipo_de_ensino,
      serie1: linha.serie1,
      n_chamada: converterIntSeguro(linha.n_chamada),
      nome_aluno: linha.nome_aluno,
      ra: linha.ra,
      dig: linha.dig,
      uf: linha.uf,
      data_nasci: converterData(linha.data_nasci),
      data_inicial: converterData(linha.data_inicial),
      data_fim: converterData(linha.data_fim),
      situacao: linha.situacao,
      data_movimentacao: converterData(linha.data_movimentacao),
      deficiencia: linha.deficiencia,
      endereco: linha.endereco,
      pos_censo: linha.pos_censo,
      genero: linha.genero,
      transporte: linha.transporte,
      etnia: linha.etnia,
      cod_turma: linha.cod_turma,
      periodo: linha.periodo,
      email_aluno: linha.email_aluno,
      ra_senha: linha.ra_senha,
      telefone: linha.telefone,
      nome_responsavel: linha.nome_responsavel,
      turma: linha.turma,
      filtro_serie: linha.filtro_serie,
      cod_escola: linha.cod_escola,
      nome_escola: linha.nome_escola,
      inep: linha.inep,
      letra_turma: linha.letra_turma,
      letra_turno: linha.letra_turno,
      tipo_32: linha.tipo_32,
      turma_escola: linha.turma_escola,
      prof1: linha.prof1,
      mais_info1: linha.mais_info1,
      mais_info2: linha.mais_info2,
      mais_info3: linha.mais_info3,
      mais_info4: linha.mais_info4,
      mais_info5: linha.mais_info5,
      mais_info6: linha.mais_info6,
    }));

    await prisma.alunos_integracao_all.createMany({
      data: dadosFormatados,
      skipDuplicates: false,
    });
    console.log(`Inseridas linhas ${i} até ${i + lote.length}`);
  }

  console.log('Importação para tabela de integração concluída.');

  // 3. Executar SQL de distribuição
  console.log('Executando SQL de distribuição...');

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
