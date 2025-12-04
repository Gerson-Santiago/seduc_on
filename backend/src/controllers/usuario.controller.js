import * as UsuarioService from '../services/usuario.service.js'
import { verificarToken } from '../utils/jwt.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const loginUsuario = asyncHandler(async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'Token é obrigatório' })

  try {
    const result = await UsuarioService.autenticarGoogle(req.prisma, token);
    res.json(result);
  } catch (error) {
    if (error.message === 'Domínio não autorizado') return res.status(403).json({ error: error.message });
    if (error.message === 'Usuário não autorizado') return res.status(401).json({ error: error.message });
    console.error('Erro no login:', error);
    res.status(401).json({ error: `Erro de login: ${error.message}` });
  }
});

export const getMe = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' })

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token inválido' })

  const payload = verificarToken(token)
  if (!payload) return res.status(401).json({ error: 'Token inválido ou expirado' })

  const usuario = await UsuarioService.findUsuarioById(req.prisma, payload.id)
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
