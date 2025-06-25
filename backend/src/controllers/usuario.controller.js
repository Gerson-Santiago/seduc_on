import { OAuth2Client } from 'google-auth-library'
import * as UsuarioService from '../services/usuario.service.js'
import { gerarToken, verificarToken } from '../utils/jwt.js'
import 'dotenv/config'
import prisma from '../../prisma/client.js' // ajuste conforme seu projeto

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID)

export async function loginUsuario(req, res) {
  const { token } = req.body

  if (!token) return res.status(400).json({ error: 'Token é obrigatório' })

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const email = payload.email
    const hd = payload.hd

    if (hd !== 'seducbertioga.com.br') {
      return res.status(403).json({ error: 'Domínio não autorizado' })
    }

    const usuario = await UsuarioService.findUsuarioByEmail(prisma, email)
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não autorizado' })
    }

    const jwtToken = gerarToken(usuario)

    return res.json({
      token: jwtToken,
      user: {
        email: usuario.email,
        nome: usuario.nome,
        role: usuario.role,
      },
    })
  } catch (err) {
    console.error('Erro no login:', err)
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

export async function getMe(req, res) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' })

    const token = authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Token inválido' })

    const payload = verificarToken(token)
    if (!payload) return res.status(401).json({ error: 'Token inválido ou expirado' })

    const usuario = await UsuarioService.findUsuarioById(prisma, payload.id)
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' })

    const { senha, ...usuarioSemSenha } = usuario
    res.json({ user: usuarioSemSenha })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro interno' })
  }
}
