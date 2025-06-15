// src/routes/usuario.routes.js
import { Router } from 'express';
import * as UsuarioController from '../controllers/usuario.controller.js';

const router = Router();

router.post('/login', UsuarioController.loginUsuario);

export default router;
