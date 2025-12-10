// backend/src/routes/escola.routes.js
import { Router } from 'express';
import * as EscolaController from '../controllers/escola.controller.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// 🔒 Proteção Global
router.use(verificarToken);

router.get('/', EscolaController.listarEscolas);
router.get('/stats', EscolaController.getStats);

export default router;
