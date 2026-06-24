// backend/src/routes/system.routes.js
import { Router } from 'express';
import logger from '../utils/logger.js';

const router = Router();

/**
 * GET /api/
 * Status básico da API (sem DB)
 */
router.get('/', (req, res) => {
  res.json({
    message: 'SEDUC ON API ONLINE',
    version: '1.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/health
 * Health check completo (API + DB)
 * Usa req.prisma injetado pelo app.js (padrão de todo o projeto)
 */
router.get('/health', async (req, res) => {
  try {
    await req.prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      backend: 'online',
      database: 'online',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Database health check failed:', error);
    return res.status(503).json({
      backend: 'online',
      database: 'offline',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
