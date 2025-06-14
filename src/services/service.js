/* ---------- src/services/aluno.service.js ---------- */
export function findAllAlunos(prisma, filters) {
  const where = {};
  if (filters.nome) where.nome_aluno = { contains: filters.nome, mode: 'insensitive' };
  if (filters.escola) where.cod_escola = filters.escola;
  return prisma.alunos.findMany({ where });
}

export function findAlunoByRa(prisma, ra) {
  return prisma.alunos.findUnique({ where: { ra } });
}

export function createAluno(prisma, data) {
  return prisma.alunos.create({ data });
}

export function updateAluno(prisma, ra, data) {
  return prisma.alunos.update({ where: { ra }, data });
}

export function deleteAluno(prisma, ra) {
  return prisma.alunos.delete({ where: { ra } });
}
