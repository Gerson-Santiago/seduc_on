// src/services/aluno.service.js

// Função para buscar estatísticas agrupadas por escola
export async function getStats(prisma) {
  // Agrupa por nome_escola e tipo_de_ensino
  const stats = await prisma.alunos_regular_ei_ef9.groupBy({
    by: ['nome_escola', 'tipo_de_ensino'],
    _count: {
      ra: true,
    },
    where: {
      situacao: 'ATIVO',
    },
    orderBy: {
      nome_escola: 'asc',
    },
  });

  // Processa os dados para o formato desejado pelo frontend
  // Formato: { "Nome da Escola": { total: 0, infantil: 0, fundamental: 0 } }
  const processed = {};

  stats.forEach(item => {
    const escola = item.nome_escola || 'Não Informada';
    const tipo = item.tipo_de_ensino;
    const count = item._count.ra;

    if (!processed[escola]) {
      processed[escola] = { escola, total: 0, infantil: 0, fundamental: 0 };
    }

    processed[escola].total += count;

    if (tipo === 'EDUCACAO INFANTIL') {
      processed[escola].infantil += count;
    } else if (tipo === 'ENSINO FUNDAMENTAL DE 9 ANOS') {
      processed[escola].fundamental += count;
    }
  });

  return Object.values(processed);
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
  return await prisma.alunos_regular_ei_ef9.create({
    data: dados,
  });
}

export async function updateAluno(prisma, ra, dados) {
  return await prisma.alunos_regular_ei_ef9.update({
    where: { ra },
    data: dados,
  });
}

export async function deleteAluno(prisma, ra) {
  return await prisma.alunos_regular_ei_ef9.delete({
    where: { ra },
  });
}
