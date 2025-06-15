// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import usuarioRoutes from './routes/usuario.routes.js';
import alunoRoutes from './routes/aluno.routes.js';
import escolaRoutes from './routes/escola.routes.js';
import matriculaRoutes from './routes/matricula.routes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
const prisma = new PrismaClient();

// Middlewares globais
app.use(helmet());                                     // Proteção de cabeçalhos
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));  // CORS
app.use(express.json());                               // Parse JSON
app.use(morgan('combined'));                           // Logs HTTP

// Injetar Prisma em todas as requisições
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
);

// Rotas principais
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/escolas', escolaRoutes);
app.use('/api/matriculas', matriculaRoutes);

// 404 e tratamento centralizado de erros
app.use(notFound);
app.use(errorHandler);

//Para teste ver as propriedados do Prisma Client
//console.log(Object.keys(prisma));


export default app;
