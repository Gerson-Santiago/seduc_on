import { jest } from '@jest/globals';

// Mock das dependências
jest.unstable_mockModule('../src/services/usuario.service.js', () => ({
    createUsuario: jest.fn(),
    findAllUsuarios: jest.fn(),
    findUsuarioByEmail: jest.fn(),
    updateUsuario: jest.fn(),
    findUsuarioById: jest.fn() // Usado no getMe
}));

jest.unstable_mockModule('../src/utils/jwt.js', () => ({
    verificarToken: jest.fn(),
    gerarToken: jest.fn()
}));

jest.unstable_mockModule('google-auth-library', () => ({
    OAuth2Client: jest.fn()
}));

// Import dinâmico
const UsuarioController = await import('../src/controllers/usuario.controller.js');
const UsuarioService = await import('../src/services/usuario.service.js');

describe('Usuario Controller - CRUD', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {},
            params: {},
            prisma: {} // Mock do prisma injetado
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('criarUsuario', () => {
        test('Deve criar usuário com sucesso (201)', async () => {
            req.body = { email: 'teste@email.com', nome: 'Teste' };
            UsuarioService.createUsuario.mockResolvedValue({ id: 1, ...req.body });

            await UsuarioController.criarUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ email: 'teste@email.com' }));
        });

        test('Deve chamar next com erro se falhar', async () => {
            const next = jest.fn();
            const erro = new Error('Erro');
            UsuarioService.createUsuario.mockRejectedValue(erro);

            await UsuarioController.criarUsuario(req, res, next);

            expect(next).toHaveBeenCalledWith(erro);
        });
    });

    describe('listarUsuarios', () => {
        test('Deve retornar lista de usuários', async () => {
            const mockUsers = [{ id: 1 }, { id: 2 }];
            UsuarioService.findAllUsuarios.mockResolvedValue(mockUsers);

            await UsuarioController.listarUsuarios(req, res);

            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });
    });

    describe('buscarUsuarioPorEmail', () => {
        test('Deve retornar usuário se encontrado', async () => {
            req.params.email = 'teste@email.com';
            UsuarioService.findUsuarioByEmail.mockResolvedValue({ id: 1, email: 'teste@email.com' });

            await UsuarioController.buscarUsuarioPorEmail(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ email: 'teste@email.com' }));
        });

        test('Deve retornar 404 se não encontrado', async () => {
            req.params.email = 'naoexiste@email.com';
            UsuarioService.findUsuarioByEmail.mockResolvedValue(null);

            await UsuarioController.buscarUsuarioPorEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
