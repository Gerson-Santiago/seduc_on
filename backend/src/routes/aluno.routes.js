// backend/src/routes/aluno.routes.js
import { Router } from 'express';
import * as AlunoController from '../controllers/aluno.controller.js';
import { verificarToken, verificarAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// 🔒 Proteção Global: Todas as rotas requerem login
router.use(verificarToken);

// 📖 Leitura: Acessível para qualquer usuário logado
router.get('/stats', AlunoController.getEstatisticas);
router.get('/', AlunoController.listarAlunos);
router.get('/:ra', AlunoController.buscarAluno);

// 🛡️ Escrita: Acessível APENAS para ADMIN
router.post('/', verificarAdmin, AlunoController.criarAluno);
router.put('/:ra', verificarAdmin, AlunoController.atualizarAluno);
router.delete('/:ra', verificarAdmin, AlunoController.removerAluno);

export default router;
