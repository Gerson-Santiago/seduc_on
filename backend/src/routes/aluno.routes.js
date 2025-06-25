// src/routes/aluno.routes.js
import { Router } from 'express';
import * as AlunoController from '../controllers/aluno.controller.js';

const router = Router();

router.get('/', AlunoController.listarAlunos);
router.post('/', AlunoController.criarAluno);
router.get('/:ra', AlunoController.buscarAluno);
router.put('/:ra', AlunoController.atualizarAluno);
router.delete('/:ra', AlunoController.removerAluno);

export default router;
