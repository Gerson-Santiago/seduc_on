// backend/src/services/aluno.service.js
import { alunoSchema, alunoUpdateSchema } from '../schemas/aluno.schema.js';

// Função para buscar estatísticas agrupadas por escola
export async function getStats(prisma) {
  // 1. Agregação Global por Série (para os cards de 1º a 5º ano)
  const seriesStats = await prisma.alunos_regular_ei_ef9.groupBy({
    by: ['filtro_serie'],
    _count: { ra: true },
    where: { situacao: 'ATIVO' },
  });


  const global = {
    bercario_1: 0,
    bercario_2: 0,
    maternal_1: 0,
    maternal_2: 0,
    pre_escola_1: 0,
    pre_escola_2: 0,
    ano_1: 0,
    ano_2: 0,
    ano_3: 0,
    ano_4: 0,
    ano_5: 0,
  };

  seriesStats.forEach(s => {
    const serie = s.filtro_serie ? s.filtro_serie.trim() : '';

    if (serie === 'BERÇARIO 1') global.bercario_1 = s._count.ra;
    if (serie === 'BERÇARIO 2') global.bercario_2 = s._count.ra;
    if (serie === 'MATERNAL 1') global.maternal_1 = s._count.ra;
    if (serie === 'MATERNAL 2') global.maternal_2 = s._count.ra;
    if (serie === 'PRÉ-ESCOLA 1') global.pre_escola_1 = s._count.ra;
    if (serie === 'PRÉ-ESCOLA 2') global.pre_escola_2 = s._count.ra;
    if (serie === '1 ANO') global.ano_1 = s._count.ra;
    if (serie === '2 ANO') global.ano_2 = s._count.ra;
    if (serie === '3 ANO') global.ano_3 = s._count.ra;
    if (serie === '4 ANO') global.ano_4 = s._count.ra;
    if (serie === '5 ANO') global.ano_5 = s._count.ra;
  });


  // 2. Agregação por Escola e Tipo/Série
  const schoolStats = await prisma.alunos_regular_ei_ef9.groupBy({
    by: ['nome_escola', 'tipo_de_ensino', 'filtro_serie'],
    _count: { ra: true },
    where: { situacao: 'ATIVO' },
    orderBy: { nome_escola: 'asc' },
  });

  const processedSchools = {};

  schoolStats.forEach(item => {
    const escola = item.nome_escola || 'Não Informada';
    const tipo = item.tipo_de_ensino;
    const serie = item.filtro_serie;
    const count = item._count.ra;

    if (!processedSchools[escola]) {
      processedSchools[escola] = {
        escola,
        total: 0,
        infantil: 0,
        fundamental: 0,
        pre_escola: 0 // Nova métrica para filtro
      };
    }

    processedSchools[escola].total += count;

    if (tipo === 'EDUCACAO INFANTIL') {
      processedSchools[escola].infantil += count;
      if (serie === 'PRÉ-ESCOLA 1' || serie === 'PRÉ-ESCOLA 2') {
        processedSchools[escola].pre_escola += count;
      }
    } else if (tipo === 'ENSINO FUNDAMENTAL DE 9 ANOS') {
      processedSchools[escola].fundamental += count;
    }
  });

  return {
    global,
    schools: Object.values(processedSchools)
  };
}

export async function findAllAlunos(prisma, filtros) {
  const { nome, escola, filtro_serie, page = 1, limit = 50 } = filtros;
  const skip = (page - 1) * limit;

  const where = {
    situacao: 'ATIVO', // Sempre filtrar ativos por padrão na listagem
    nome_aluno: nome ? { contains: nome, mode: 'insensitive' } : undefined,
    nome_escola: escola ? { contains: escola, mode: 'insensitive' } : undefined,
    filtro_serie: filtro_serie ? { equals: filtro_serie } : undefined,
  };

  const [alunos, total] = await Promise.all([
    prisma.alunos_regular_ei_ef9.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { nome_aluno: 'asc' },
    }),
    prisma.alunos_regular_ei_ef9.count({ where }),
  ]);

  return { alunos, total, pages: Math.ceil(total / limit) };
}

export async function findAlunoByRa(prisma, ra) {
  return await prisma.alunos_regular_ei_ef9.findUnique({
    where: { ra },
  });
}

// Funções de escrita (Create/Update/Delete) precisariam ser adaptadas para a nova estrutura
// Por enquanto, vamos focar na leitura conforme solicitado.
// Se for necessário criar/editar, teremos que decidir se editamos a tabela de integração ou a final.
// Assumindo edição direta na tabela final por enquanto.

export async function createAluno(prisma, dados) {
  // 🛡️ SECURITY: Mass Assignment Protection
  // Valida e filtra apenas os campos permitidos pelo Schema.
  // Campos extras injetados (ex: isAdmin) serão removidos automaticamente.
  const dataValidada = alunoSchema.parse(dados);

  return await prisma.alunos_regular_ei_ef9.create({
    data: dataValidada, // Usa apenas dados da whitelist
  });
}

export async function updateAluno(prisma, ra, dados) {
  // 🛡️ SECURITY: Mass Assignment Protection
  const dataValidada = alunoUpdateSchema.parse(dados);

  return await prisma.alunos_regular_ei_ef9.update({
    where: { ra },
    data: dataValidada,
  });
}

export async function deleteAluno(prisma, ra) {
  return await prisma.alunos_regular_ei_ef9.delete({
    where: { ra },
  });
}
