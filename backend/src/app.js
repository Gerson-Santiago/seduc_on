// backend/src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'; // Moved to top
import { PrismaClient } from '@prisma/client';
import usuarioRoutes from './routes/usuario.routes.js';
import alunoRoutes from './routes/aluno.routes.js';
import escolaRoutes from './routes/escola.routes.js';
import accessRequestsRouter from './routes/accessRequests.js';
import { notFound, errorHandler } from './middleware/error.js';
import { getBackendConfig } from './config/environments.js'
import { apiLimiter } from './middleware/rateLimiter.js';
// importação das rotas da SED @testeAPI_SED
import sedRoutes from './routes/sed.routes.js';
import logger from './utils/logger.js'; // Importar Logger Seguro


const { ALLOWED_ORIGINS } = getBackendConfig()

const app = express();
const prisma = new PrismaClient();

app.use(helmet({
  contentSecurityPolicy: false, // API não serve HTML
  crossOriginEmbedderPolicy: false,
  hidePoweredBy: true, // Remove X-Powered-By: Express
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true
  }
}));
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }))

app.use(express.json());

// Morgan streamando para o Winston (como info)
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));


// ... (other imports)

// Aplicar Rate Limiting
app.use(apiLimiter);

// Parsear Cookies (Necessário para Auth Segura)
app.use(cookieParser());

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
    logger.error("Database health check failed:", error); // Usando logger seguro
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
app.use('/api/escolas', escolaRoutes);
app.use('/api/access-requests', accessRequestsRouter);

// outras rotas...

// Middleware de erro
app.use(notFound);

// Intercepta erros para logar antes do handler final (se necessário, mas o errorHandler pode fazer isso)
// Vamos deixar o errorHandler lidar, mas idealmente ele deveria usar o logger.
// Como não vou editar o error.js agora, adicionamos um interceptor aqui ou assumimos que o error.js logs to console?
// Melhor: editar o error.js seria ideal, mas vou adicionar um middleware de log de erro ANTES do errorHandler
app.use((err, req, res, next) => {
  logger.error(`Erro na requisição ${req.method} ${req.url}`, { error: err.message, stack: err.stack });
  next(err);
});

app.use(errorHandler);

export default app;