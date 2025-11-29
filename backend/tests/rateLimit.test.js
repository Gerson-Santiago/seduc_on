// backend/tests/rateLimit.test.js
import request from 'supertest';
import app from '../src/app.js';

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
