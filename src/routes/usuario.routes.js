// src/routes/usuario.routes.js
import { Router } from 'express';
import * as UsuarioController from '../controllers/usuario.controller.js';

const router = Router();

router.post('/login', UsuarioController.loginUsuario);

// Rota protegida GET /me para retornar dados do usuário autenticado
router.get('/me', UsuarioController.getMe);

export default router;
