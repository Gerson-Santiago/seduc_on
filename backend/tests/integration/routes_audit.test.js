import request from 'supertest';
import app from '../../src/app.js';

describe('🛡️ Rotas Audit (Automated Scan)', () => {

    // Lista de rotas que DEVEM ser protegidas
    const criticalEndpoints = [
        { method: 'get', path: '/api/alunos' },
        { method: 'post', path: '/api/alunos' },
        { method: 'get', path: '/api/escolas' },
        { method: 'get', path: '/api/usuarios' },
        // /api/usuarios/me usually requires token, let's check basic listing
    ];

    test.each(criticalEndpoints)('Endpoint $method $path deve rejeitar anônimos (401)', async ({ method, path }) => {
        const res = await request(app)[method](path);

        if (res.status !== 401) {
            console.error(`🚨 ROTA EXPOSTA: ${method.toUpperCase()} ${path} retornou ${res.status}`);
        }

        expect(res.status).toBe(401);
    });
});
