import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Mock ESM antes do import estático não funciona bem com mock factory
// Usando unstable_mockModule
await jest.unstable_mockModule('../../src/services/usuario.service.js', () => ({
    autenticarGoogle: jest.fn().mockResolvedValue({
        id: 1,
        email: 'teste@seducbertioga.com.br',
        nome: 'Teste',
        token: 'fake_jwt_token',
        role: 'ADMIN',
        picture: 'http://foto.com'
    })
}));

// Importação dinâmica APÓS o mock
const UsuarioController = await import('../../src/controllers/usuario.controller.js');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));

app.post('/login', UsuarioController.loginUsuario);

describe('Debug Login Controller', () => {
    test('Deve setar cookie e retornar 200', async () => {
        const response = await request(app)
            .post('/login')
            .send({ token: 'fake_google_credential' });

        console.log('Status:', response.status);
        console.log('Body:', response.body);

        expect(response.status).toBe(200);

        // Verifica se setou cookie
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();
        // O cookie é 'token'
        // Ex: token=fake_jwt_token; Max-Age=86400; Path=/; HttpOnly; SameSite=Lax
        const tokenCookie = cookies.find(c => c.startsWith('token='));
        expect(tokenCookie).toBeDefined();
        expect(tokenCookie).toContain('fake_jwt_token');
        expect(tokenCookie).toContain('HttpOnly');
    });
});
