import { Router } from 'express';
import * as UsuarioController from '../controllers/usuario.controller.js';
import { verificarToken, verificarAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { usuarioSchema, usuarioUpdateSchema } from '../schemas/usuario.schema.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Rotas de Autenticação (Públicas)
router.post('/login', loginLimiter, UsuarioController.loginUsuario);
router.post('/logout', UsuarioController.logoutUsuario);

// Rotas protegidas
router.use(verificarToken);

router.get('/me', UsuarioController.getMe);

// Rotas CRUD
router.post('/', verificarAdmin, validate(usuarioSchema), UsuarioController.criarUsuario);
router.get('/', verificarAdmin, UsuarioController.listarUsuarios);
router.get('/:email', UsuarioController.buscarUsuarioPorEmail);
router.put('/:id', verificarAdmin, validate(usuarioUpdateSchema), UsuarioController.atualizarUsuario);

export default router;
