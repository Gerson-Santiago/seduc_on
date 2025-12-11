import * as UsuarioService from '../services/usuario.service.js'
import { verificarToken } from '../utils/jwt.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const loginUsuario = asyncHandler(async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'Token é obrigatório' })

  try {
    const result = await UsuarioService.autenticarGoogle(req.prisma, token);

    // 🍪 SECURITY: HTTP-Only Cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: isProd, // HTTPS only in production
      sameSite: 'Lax', // CSRF protection + UX
      maxAge: 24 * 60 * 60 * 1000 // 1 dia
    });

    res.json({ ...result, token: undefined }); // Don't send token in body anymore (or keep for compatibility if needed, but safer to remove)
  } catch (error) {
    if (error.message === 'Domínio não autorizado') return res.status(403).json({ error: error.message });
    if (error.message === 'Usuário não autorizado') return res.status(401).json({ error: error.message });
    console.error('Erro no login:', error);
    res.status(401).json({ error: `Erro de login: ${error.message}` });
  }
});

export const logoutUsuario = (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax'
  });
  res.status(200).json({ message: 'Logout realizado com sucesso' });
};

export const getMe = asyncHandler(async (req, res) => {
  // O middleware verificarToken já populou req.user
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const usuario = await UsuarioService.findUsuarioById(req.prisma, req.user.id)
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' })

  const { senha, ...usuarioSemSenha } = usuario
  res.json({ user: usuarioSemSenha })
});

export const criarUsuario = asyncHandler(async (req, res) => {
  const usuario = await UsuarioService.createUsuario(req.prisma, req.body);
  res.status(201).json(usuario);
});

export const listarUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await UsuarioService.findAllUsuarios(req.prisma);
  res.json(usuarios);
});

export const buscarUsuarioPorEmail = asyncHandler(async (req, res) => {
  const usuario = await UsuarioService.findUsuarioByEmail(req.prisma, req.params.email);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(usuario);
});

export const atualizarUsuario = asyncHandler(async (req, res) => {
  const usuario = await UsuarioService.updateUsuario(req.prisma, Number(req.params.id), req.body);
  res.json(usuario);
});
