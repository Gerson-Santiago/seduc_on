// backend/src/services/usuario.service.js

export async function findUsuarioByEmail(prisma, email) {
  return await prisma.usuario.findUnique({
    where: { email },
  });
}

export async function findUsuarioById(prisma, id) {
  return await prisma.usuario.findUnique({
    where: { id },
  });
}

export async function updateUsuario(prisma, id, data) {
  return await prisma.usuario.update({
    where: { id },
    data,
  });
}

export async function createUserFromRequest(prisma, reqRow) {
  return await prisma.usuario.create({
    data: {
      email: reqRow.email,
      nome: reqRow.nome_completo,
      perfil: 'comum',
      ativo: true,
      criadoEm: new Date(),
      registro_funcional: reqRow.registro_funcional,
      contador_registro_funcional: reqRow.contador_registro_funcional,
      cargo: reqRow.cargo,
      setor: reqRow.setor,
    }
  });
}
