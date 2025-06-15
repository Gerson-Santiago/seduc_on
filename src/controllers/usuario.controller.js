// src/controllers/usuario.controller.js
import * as UsuarioService from '../services/usuario.service.js';

export async function loginUsuario(req, res) {
  const { email } = req.body;

  try {
    const usuario = await UsuarioService.findUsuarioByEmail(req.prisma, email);

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não autorizado' });
    }

    return res.json({
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro no servidor', details: err.message });
  }
}
