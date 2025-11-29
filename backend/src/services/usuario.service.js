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
