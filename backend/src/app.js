// backend/src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import usuarioRoutes from './routes/usuario.routes.js';
import alunoRoutes from './routes/aluno.routes.js';
import escolaRoutes from './routes/escola.routes.js';
import accessRequestsRouter from './routes/accessRequests.js';
import sedRoutes from './routes/sed.routes.js';
import systemRoutes from './routes/system.routes.js';
import { notFound, errorHandler } from './middleware/error.js';
import { getBackendConfig } from './config/environments.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import logger from './utils/logger.js';

const { ALLOWED_ORIGINS } = getBackendConfig();

const app = express();
const prisma = new PrismaClient();

// ── Segurança ────────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // API não serve HTML
  crossOriginEmbedderPolicy: false,
  hidePoweredBy: true,          // Remove X-Powered-By: Express
  hsts: {
    maxAge: 31536000,           // 1 ano
    includeSubDomains: true,
    preload: true
  }
}));
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

// ── Parsing ──────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// ── Rate Limiting ────────────────────────────────────────────────────────────
app.use(apiLimiter);

// ── Injeção de dependências ──────────────────────────────────────────────────
// Disponibiliza o prisma em req.prisma para todos os controllers/routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// ── Rotas ────────────────────────────────────────────────────────────────────
app.use('/api', systemRoutes);          // GET /api/  e  GET /api/health
app.use('/api/sed', sedRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/escolas', escolaRoutes);
app.use('/api/access-requests', accessRequestsRouter);

// ── Tratamento de erros ──────────────────────────────────────────────────────
app.use(notFound);

app.use((err, req, res, next) => {
  logger.error(`Erro na requisição ${req.method} ${req.url}`, {
    error: err.message,
    stack: err.stack
  });
  next(err);
});

app.use(errorHandler);

export default app;
