// src/routes/matricula.routes.js
import { Router } from 'express';
import * as MatriculaController from '../controllers/matricula.controller.js';

const router = Router();

// GET /api/matriculas
router.get('/', MatriculaController.listarMatriculas);

export default router;
