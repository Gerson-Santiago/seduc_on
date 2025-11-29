// backend/src/controllers/aluno.controller.js
/* ---------- src/controllers/aluno.controller.js ---------- */
import * as AlunoService from '../services/aluno.service.js';

function handleError(res, err) {
  console.error('Erro capturado:', err);
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }
  return res.status(500).json({ error: 'Erro interno.', details: err.message });
}


export async function getEstatisticas(req, res) {
  try {
    const stats = await AlunoService.getStats(req.prisma);
    res.json(stats);
  } catch (err) {
    handleError(res, err);
  }
}

export async function listarAlunos(req, res) {
  const { ra, nome, escola, filtro_serie, page, limit } = req.query;
  try {
    if (ra) {
      const aluno = await AlunoService.findAlunoByRa(req.prisma, ra);
      if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
      return res.json(aluno);
    }
    const resultado = await AlunoService.findAllAlunos(req.prisma, { nome, escola, filtro_serie, page, limit });
    res.json(resultado);
  } catch (err) {
    handleError(res, err);
  }
}

export async function buscarAluno(req, res) {
  try {
    const aluno = await AlunoService.findAlunoByRa(req.prisma, req.params.ra);
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (err) {
    handleError(res, err);
  }
}

export async function criarAluno(req, res) {
  try {
    const aluno = await AlunoService.createAluno(req.prisma, req.body);
    res.status(201).json(aluno);
  } catch (err) {
    handleError(res, err);
  }
}

export async function atualizarAluno(req, res) {
  try {
    const aluno = await AlunoService.updateAluno(req.prisma, req.params.ra, req.body);
    res.json(aluno);
  } catch (err) {
    handleError(res, err);
  }
}

export async function removerAluno(req, res) {
  try {
    await AlunoService.deleteAluno(req.prisma, req.params.ra);
    res.status(204).end();
  } catch (err) {
    handleError(res, err);
  }
}
