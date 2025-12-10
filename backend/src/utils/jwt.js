// backend/src/utils/jwt.js
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('FATAL: JWT_SECRET não definida no ambiente.');
}


export function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
      picture: usuario.picture,
    },
    SECRET,
    { expiresIn: '1d' }
  );
}

export function verificarToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
