import { OAuth2Client } from 'google-auth-library';
import { gerarToken } from '../utils/jwt.js';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export async function autenticarGoogle(prisma, token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, hd, picture, name } = payload;

  if (hd !== 'seducbertioga.com.br') {
    throw new Error('Domínio não autorizado');
  }

  const usuario = await findUsuarioByEmail(prisma, email);
  if (!usuario) {
    throw new Error('Usuário não autorizado');
  }

  // Atualiza foto se necessário
  if (picture && usuario.picture !== picture) {
    await updateUsuario(prisma, usuario.id, { picture });
    usuario.picture = picture;
  }

  const jwtToken = gerarToken({ ...usuario, picture });

  return {
    token: jwtToken,
    user: {
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
      picture: usuario.picture,
    }
  };
}

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

export async function createUsuario(prisma, data) {
  return await prisma.usuario.create({
    data
  });
}

export async function findAllUsuarios(prisma) {
  return await prisma.usuario.findMany();
}
