// backend/src/app.js
// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import usuarioRoutes from './routes/usuario.routes.js';
import alunoRoutes from './routes/aluno.routes.js';
import accessRequestsRouter from './routes/accessRequests.js';
import { notFound, errorHandler } from './middleware/error.js';
import { getBackendConfig } from './config/environments.js'
import { apiLimiter } from './middleware/rateLimiter.js';
// importação das rotas da SED @testeAPI_SED
import sedRoutes from './routes/sed.routes.js';


const { ALLOWED_ORIGINS } = getBackendConfig()

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }))

app.use(express.json());
app.use(morgan('combined'));

// Aplicar Rate Limiting
app.use(apiLimiter);

// Injetar prisma
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Registrar rotas da SED
app.use('/api/sed', sedRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Tenta executar uma query simples para verificar a conexão com o banco
    await req.prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      backend: 'online',
      database: 'online',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Se a query falhar, o banco está offline
    console.error("Database health check failed:", error);
    res.status(503).json({
      backend: 'online',
      database: 'offline',
      timestamp: new Date().toISOString()
    });
  }
});

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/access-requests', accessRequestsRouter);

// outras rotas...

// Middleware de erro
app.use(notFound);
app.use(errorHandler);

export default app;