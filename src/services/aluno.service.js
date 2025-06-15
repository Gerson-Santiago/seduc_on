// src/service/aluno.service.js
export async function findAllAlunos(prisma, filtros) {
  const { nome, escola } = filtros;

  return await prisma.alunos.findMany({
    where: {
      nome: nome ? { contains: nome, mode: 'insensitive' } : undefined,
      escola: escola ? { contains: escola, mode: 'insensitive' } : undefined,
    },
  });
}

export async function findAlunoByRa(prisma, ra) {
  return await prisma.alunos.findFirst({
    where: {
      ra,
      situacao: 'ATIVO',
      NOT: {
        tipo_de_ensino: 'ATENDIMENTO EDUCACIONAL ESPECIALIZADO',
      },
    },
  });
}


export async function createAluno(prisma, dados) {
  return await prisma.alunos.create({
    data: dados,
  });
}

export async function updateAluno(prisma, ra, dados) {
  return await prisma.alunos.update({
    where: { ra },
    data: dados,
  });
}

export async function deleteAluno(prisma, ra) {
  return await prisma.alunos.delete({
    where: { ra },
  });
}

