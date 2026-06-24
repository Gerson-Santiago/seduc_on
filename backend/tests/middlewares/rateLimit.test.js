// backend/tests/middlewares/rateLimit.test.js

import { jest } from '@jest/globals';

// Mock do Prisma para não depender do banco nos testes de rate limit.
// Deve ser declarado ANTES das importações dinâmicas (padrão ESM + Jest).
jest.unstable_mockModule('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    })),
}));

// Com ESM + mocks, os imports devem ser dinâmicos (await import) para que o
// mock já esteja registrado quando o módulo for carregado.
const { default: request } = await import('supertest');
const { default: app } = await import('../../src/app.js');

describe('Rate Limiting', () => {
    it('should allow requests under the limit', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
    });

    // Nota: Testar o limite exato pode ser demorado ou complexo em testes unitários
    // se o limite for alto (100).
    // Para este teste, vamos apenas garantir que os headers de rate limit estão presentes.

    it('should have rate limit headers', async () => {
        const res = await request(app).get('/api/health');
        expect(res.headers['ratelimit-limit']).toBeDefined();
        expect(res.headers['ratelimit-remaining']).toBeDefined();
        expect(res.headers['ratelimit-reset']).toBeDefined();
    });
});
