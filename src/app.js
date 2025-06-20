// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import usuarioRoutes from './routes/usuario.routes.js';
import alunoRoutes from './routes/aluno.routes.js';
import { notFound, errorHandler } from './middleware/error.js';
import gitStatusRouter from './routes/gitStatus.js'

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('combined'));
app.use('/api', gitStatusRouter)

// Injetar prisma
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/alunos', alunoRoutes);

// outras rotas...

// Middleware de erro
app.use(notFound);
app.use(errorHandler);

export default app;