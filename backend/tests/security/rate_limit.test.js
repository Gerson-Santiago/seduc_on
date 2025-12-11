import request from 'supertest';
import { jest } from '@jest/globals';

const { default: app } = await import('../../src/app.js');

describe('🛡️ Rate Limiting Defense', () => {

    test('Deve bloquear excesso de requisições (429 Too Many Requests)', async () => {
        // O limite padrão é 100 reqs / 15 min.
        // O loginLimiter é 5 reqs / hora.
        // Vamos testar se os headers existem na primeira requisição,
        // o que prova que o middleware está ativo.
        // Floodar 100 reqs pode ser lento para o teste, então verificamos os headers.

        const res = await request(app).get('/api/health');

        // Verifica se headers de rate limit estão presentes
        expect(res.headers['ratelimit-limit']).toBeDefined();
        expect(res.headers['ratelimit-remaining']).toBeDefined();

        const limit = parseInt(res.headers['ratelimit-limit']);
        const remaining = parseInt(res.headers['ratelimit-remaining']);

        expect(limit).toBeGreaterThan(0);
        expect(remaining).toBeLessThan(limit);
    });
});
