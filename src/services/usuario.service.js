// src/services/usuario.service.js
export async function findUsuarioByEmail(prisma, email) {
  return await prisma.usuario.findUnique({
    where: { email },
  });
}
