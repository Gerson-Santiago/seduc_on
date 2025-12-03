/**
 * @file aluno.controller.js
 * @description Controller responsável por gerenciar as requisições HTTP relacionadas a alunos.
 * Implementa operações CRUD (Create, Read, Update, Delete) e funcionalidades de busca e estatísticas.
 */

import * as AlunoService from '../services/aluno.service.js';

/**
 * Função auxiliar para tratamento centralizado de erros.
 *
 * @private
 * @param {Object} res - Objeto de resposta HTTP do Express
 * @param {Error} err - Objeto de erro capturado
 * @returns {Object} Resposta JSON com código de status apropriado
 *
 * @example
 * // Erro de aluno não encontrado (Prisma P2025)
 * handleError(res, { code: 'P2025' }) // 404: Aluno não encontrado
 *
 * @example
 * // Erro genérico
 * handleError(res, new Error('Erro de validação')) // 500: Erro interno
 */
function handleError(res, err) {
  console.error('Erro capturado:', err);
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }
  return res.status(500).json({ error: 'Erro interno.', details: err.message });
}

/**
 * Retorna estatísticas gerais dos alunos.
 *
 * @async
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} req.prisma - Instância do Prisma Client
 * @param {Object} res - Objeto de resposta HTTP
 * @returns {Promise<void>}
 *
 * @description
 * Obtém estatísticas agregadas sobre os alunos cadastrados no sistema,
 * como total de alunos, distribuição por série, escola, etc.
 *
 * @example
 * // GET /api/alunos/estatisticas
 * // Response 200:
 * // {
 * //   total: 150,
 * //   porSerie: { "1 ANO": 30, "2 ANO": 25, ... },
 * //   porEscola: { "EM PROF JOÃO": 50, ... }
 * // }
 *
 * @throws {500} Erro interno do servidor
 */
export async function getEstatisticas(req, res) {
  try {
    const stats = await AlunoService.getStats(req.prisma);
    res.json(stats);
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * Lista alunos com suporte a filtros e paginação, ou busca um aluno específico por RA.
 *
 * @async
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} req.query - Parâmetros de consulta
 * @param {string} [req.query.ra] - RA do aluno para busca específica
 * @param {string} [req.query.nome] - Filtro por nome do aluno (busca parcial)
 * @param {string} [req.query.escola] - Filtro por escola
 * @param {string} [req.query.filtro_serie] - Filtro por série
 * @param {number} [req.query.page=1] - Número da página para paginação
 * @param {number} [req.query.limit=10] - Limite de resultados por página
 * @param {Object} req.prisma - Instância do Prisma Client
 * @param {Object} res - Objeto de resposta HTTP
 * @returns {Promise<void>}
 *
 * @description
 * Se o parâmetro `ra` for fornecido, retorna apenas o aluno correspondente.
 * Caso contrário, retorna uma lista paginada de alunos com base nos filtros fornecidos.
 *
 * @example
 * // Buscar aluno específico por RA
 * // GET /api/alunos?ra=123456
 * // Response 200: { ra: "123456", nome: "João Silva", ... }
 * // Response 404: { error: "Aluno não encontrado" }
 *
 * @example
 * // Listar alunos com filtros e paginação
 * // GET /api/alunos?nome=Silva&escola=EM PROF JOÃO&page=1&limit=20
 * // Response 200: {
 * //   data: [{ ra: "123", nome: "João Silva", ... }, ...],
 * //   total: 45,
 * //   page: 1,
 * //   limit: 20
 * // }
 *
 * @throws {404} Aluno não encontrado (quando busca por RA específico)
 * @throws {500} Erro interno do servidor
 */
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

/**
 * Busca um aluno específico pelo RA (Registro do Aluno).
 *
 * @async
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.ra - RA do aluno a ser buscado
 * @param {Object} req.prisma - Instância do Prisma Client
 * @param {Object} res - Objeto de resposta HTTP
 * @returns {Promise<void>}
 *
 * @description
 * Retorna os dados completos de um aluno identificado pelo seu RA.
 *
 * @example
 * // GET /api/alunos/123456
 * // Response 200:
 * // {
 * //   ra: "123456",
 * //   nome: "Maria Santos",
 * //   escola: "EM PROF JOÃO",
 * //   filtro_serie: "3 ANO",
 * //   ...
 * // }
 *
 * @throws {404} Aluno não encontrado
 * @throws {500} Erro interno do servidor
 */
export async function buscarAluno(req, res) {
  try {
    const aluno = await AlunoService.findAlunoByRa(req.prisma, req.params.ra);
    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * Cria um novo registro de aluno no sistema.
 *
 * @async
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} req.body - Dados do aluno a ser criado
 * @param {string} req.body.ra - RA do aluno (obrigatório, único)
 * @param {string} req.body.nome - Nome completo do aluno (obrigatório)
 * @param {string} req.body.escola - Escola do aluno
 * @param {string} req.body.filtro_serie - Série/ano do aluno
 * @param {Object} req.prisma - Instância do Prisma Client
 * @param {Object} res - Objeto de resposta HTTP
 * @returns {Promise<void>}
 *
 * @description
 * Cria um novo aluno no banco de dados com os dados fornecidos no corpo da requisição.
 *
 * @example
 * // POST /api/alunos
 * // Body: {
 * //   "ra": "789012",
 * //   "nome": "Carlos Pereira",
 * //   "escola": "EM PROF JOÃO",
 * //   "filtro_serie": "4 ANO"
 * // }
 * // Response 201: { ra: "789012", nome: "Carlos Pereira", ... }
 *
 * @throws {400} Dados inválidos ou RA já existente
 * @throws {500} Erro interno do servidor
 */
export async function criarAluno(req, res) {
  try {
    const aluno = await AlunoService.createAluno(req.prisma, req.body);
    res.status(201).json(aluno);
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * Atualiza os dados de um aluno existente.
 *
 * @async
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.ra - RA do aluno a ser atualizado
 * @param {Object} req.body - Dados a serem atualizados
 * @param {string} [req.body.nome] - Nome completo do aluno
 * @param {string} [req.body.escola] - Escola do aluno
 * @param {string} [req.body.filtro_serie] - Série/ano do aluno
 * @param {Object} req.prisma - Instância do Prisma Client
 * @param {Object} res - Objeto de resposta HTTP
 * @returns {Promise<void>}
 *
 * @description
 * Atualiza campos específicos de um aluno identificado pelo RA.
 * Apenas os campos fornecidos no body serão atualizados.
 *
 * @example
 * // PUT /api/alunos/123456
 * // Body: { "filtro_serie": "4 ANO", "escola": "EM NOVA ESCOLA" }
 * // Response 200: { ra: "123456", nome: "Maria Santos", filtro_serie: "4 ANO", escola: "EM NOVA ESCOLA", ... }
 *
 * @throws {404} Aluno não encontrado
 * @throws {400} Dados inválidos
 * @throws {500} Erro interno do servidor
 */
export async function atualizarAluno(req, res) {
  try {
    const aluno = await AlunoService.updateAluno(req.prisma, req.params.ra, req.body);
    res.json(aluno);
  } catch (err) {
    handleError(res, err);
  }
}

/**
 * Remove um aluno do sistema.
 *
 * @async
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.ra - RA do aluno a ser removido
 * @param {Object} req.prisma - Instância do Prisma Client
 * @param {Object} res - Objeto de resposta HTTP
 * @returns {Promise<void>}
 *
 * @description
 * Remove permanentemente o registro de um aluno do banco de dados.
 * Operação irreversível que deleta todos os dados associados ao aluno.
 *
 * @example
 * // DELETE /api/alunos/123456
 * // Response 204: (sem corpo de resposta)
 *
 * @throws {404} Aluno não encontrado
 * @throws {500} Erro interno do servidor
 */
export async function removerAluno(req, res) {
  try {
    await AlunoService.deleteAluno(req.prisma, req.params.ra);
    res.status(204).end();
  } catch (err) {
    handleError(res, err);
  }
}
