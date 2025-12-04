
import { jest } from '@jest/globals';

// Mock do serviço usando unstable_mockModule para suporte a ESM
jest.unstable_mockModule('../../src/services/usuario.service.js', () => ({
    autenticarGoogle: jest.fn(),
    findUsuarioById: jest.fn(),
    findUsuarioByEmail: jest.fn(),
    createUsuario: jest.fn(),
    updateUsuario: jest.fn(),
    findAllUsuarios: jest.fn(),
}));

// Importação dinâmica dos módulos após o mock
const { loginUsuario } = await import('../../src/controllers/usuario.controller.js');
const UsuarioService = await import('../../src/services/usuario.service.js');

describe('Autenticação Google - Backend', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, prisma: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('Cenários de Erro', () => {
        test('Deve retornar 400 se o token estiver ausente', async () => {
            await loginUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Token é obrigatório' });
        });

        test('Deve retornar 403 se o domínio não for autorizado', async () => {
            req.body.token = 'valid-token';
            UsuarioService.autenticarGoogle.mockRejectedValue(new Error('Domínio não autorizado'));

            await loginUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Domínio não autorizado' });
        });

        test('Deve retornar 401 se o usuário não estiver autorizado (não cadastrado)', async () => {
            req.body.token = 'valid-token';
            UsuarioService.autenticarGoogle.mockRejectedValue(new Error('Usuário não autorizado'));

            await loginUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não autorizado' });
        });

        test('Deve retornar 401 para erros genéricos (token inválido)', async () => {
            req.body.token = 'invalid-token';
            UsuarioService.autenticarGoogle.mockRejectedValue(new Error('Some other error'));

            await loginUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
        });
    });

    describe('Cenários de Sucesso', () => {
        test('Deve retornar 200 e o token JWT quando o login for bem-sucedido', async () => {
            req.body.token = 'valid-google-token';
            const mockUser = {
                token: 'jwt-token-exemplo',
                user: {
                    email: 'teste@seducbertioga.com.br',
                    nome: 'Usuário Teste',
                    role: 'admin',
                    picture: 'https://foto.com/user.jpg'
                }
            };

            UsuarioService.autenticarGoogle.mockResolvedValue(mockUser);

            await loginUsuario(req, res);

            expect(UsuarioService.autenticarGoogle).toHaveBeenCalledWith(req.prisma, 'valid-google-token');
            expect(res.json).toHaveBeenCalledWith(mockUser);
            // Não deve chamar status com erro
            expect(res.status).not.toHaveBeenCalledWith(400);
            expect(res.status).not.toHaveBeenCalledWith(401);
            expect(res.status).not.toHaveBeenCalledWith(403);
        });
    });
});
