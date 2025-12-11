import request from 'supertest';
import { jest } from '@jest/globals';

// Mocks devem vir antes dos imports dinâmicos
jest.unstable_mockModule('../../src/services/usuario.service.js', () => ({
    autenticarGoogle: jest.fn(),
    findUsuarioById: jest.fn(),
    createUsuario: jest.fn(),
    createUserFromRequest: jest.fn(),
    findUsuarioByEmail: jest.fn(),
    updateUsuario: jest.fn(),
    findAllUsuarios: jest.fn(),
}));

const UsuarioService = await import('../../src/services/usuario.service.js');
const { default: app } = await import('../../src/app.js');

describe('🍪 Session Security (Cookies)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Login deve retornar Set-Cookie com HttpOnly e SameSite=Lax', async () => {
        UsuarioService.autenticarGoogle.mockResolvedValue({
            token: 'fake-jwt-token',
            user: { id: 1, email: 'test@b.com' }
        });

        const res = await request(app)
            .post('/api/usuarios/login')
            .send({ token: 'google-token' });

        expect(res.status).toBe(200);

        // Verificar headers de cookie
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();

        // Express retorna array de strings. Ex: ['token=...; Path=/; HttpOnly; SameSite=Lax']
        const tokenCookie = cookies.find(c => c.startsWith('token='));
        expect(tokenCookie).toBeDefined();
        expect(tokenCookie).toContain('HttpOnly');
        expect(tokenCookie).toContain('SameSite=Lax');
        expect(tokenCookie).toContain('fake-jwt-token');
    });

    test('Logout deve limpar o cookie (Max-Age=0 ou Expires past)', async () => {
        const res = await request(app)
            .post('/api/usuarios/logout');

        expect(res.status).toBe(200);

        const cookies = res.headers['set-cookie'];
        const tokenCookie = cookies.find(c => c.startsWith('token='));

        // Verificar se o valor está vazio ou expira
        // Express clearCookie geralmente define valor vazio e expires=Thu, 01 Jan 1970 00:00:00 GMT
        expect(tokenCookie).toBeDefined();
        expect(tokenCookie).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    });

});
