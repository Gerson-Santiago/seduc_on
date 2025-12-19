// backend/tests/auth.test.js
import { jest } from '@jest/globals';

// Mock das dependências
jest.unstable_mockModule('../../src/services/usuario.service.js', () => ({
  autenticarGoogle: jest.fn(),
  findUsuarioById: jest.fn()
}));

jest.unstable_mockModule('../../src/utils/jwt.js', () => ({
  verificarToken: jest.fn(),
}));

// Importa o controller DEPOIS dos mocks
const { loginUsuario } = await import('../../src/controllers/usuario.controller.js');
const UsuarioService = await import('../../src/services/usuario.service.js');

describe('Usuario Controller - Login', () => {

  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, prisma: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
  });

  test('Deve realizar login com sucesso', async () => {
    req.body.token = 'valid_token';

    const mockResult = {
      token: 'mocked_jwt_token',
      user: { email: 'test@seducbertioga.com.br' }
    };

    UsuarioService.autenticarGoogle.mockResolvedValue(mockResult);

    await loginUsuario(req, res);

    expect(res.cookie).toHaveBeenCalledWith('token', 'mocked_jwt_token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ ...mockResult, token: undefined });
  });

  test('Deve retornar 403 para domínio inválido', async () => {
    req.body.token = 'invalid_token';
    UsuarioService.autenticarGoogle.mockRejectedValue(new Error('Domínio não autorizado'));

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Domínio não autorizado' });
  });

  test('Deve retornar 401 para usuário não autorizado', async () => {
    req.body.token = 'valid_token';
    UsuarioService.autenticarGoogle.mockRejectedValue(new Error('Usuário não autorizado'));

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não autorizado' });
  });
});
