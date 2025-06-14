// src/routes/escola.routes.js
import { Router } from 'express';
import * as EscolaController from '../controllers/escola.controller.js';

const router = Router();

router.get('/', EscolaController.listarEscolas);

export default router;
