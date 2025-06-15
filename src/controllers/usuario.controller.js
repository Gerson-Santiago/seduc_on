// src/controllers/usuario.controller.js
import * as UsuarioService from '../services/usuario.service.js';
import { gerarToken } from '../utils/jwt.js';

export async function loginUsuario(req, res) {
  const { email } = req.body;
  console.log('Email recebido no backend:', email);

  try {
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const usuario = await UsuarioService.findUsuarioByEmail(req.prisma, email);

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não autorizado' });
    }

    const token = gerarToken(usuario);

    return res.json({
      token,
      usuario: {
        email: usuario.email,
        nome: usuario.nome,
        role: usuario.role,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro no servidor', details: err.message });
  }
}
