// src/controllers/usuario.controller.js
import { OAuth2Client } from 'google-auth-library'
import * as UsuarioService from '../services/usuario.service.js'
import { gerarToken } from '../utils/jwt.js'

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

    // Verifica domínio do email
    if (hd !== 'seducbertioga.com.br') {
      return res.status(403).json({ error: 'Domínio não autorizado' })
    }

    const usuario = await UsuarioService.findUsuarioByEmail(req.prisma, email)
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
