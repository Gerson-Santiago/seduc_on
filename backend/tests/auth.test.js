// backend/tests/auth.test.js
import { jest } from '@jest/globals';

// Mock das dependências
jest.unstable_mockModule('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn().mockImplementation(async ({ idToken }) => {
      if (idToken === 'valid_token') {
        return {
          getPayload: () => ({
            email: 'test@seducbertioga.com.br', // Domínio correto
            name: 'Test User',
            picture: 'http://example.com/pic.jpg',
            hd: 'seducbertioga.com.br'
          })
        };
      }
      if (idToken === 'invalid_domain_token') {
        return {
          getPayload: () => ({
            email: 'test@gmail.com',
            hd: 'gmail.com'
          })
        };
      }
      throw new Error('Invalid token');
    })
  }))
}));

jest.unstable_mockModule('../src/services/usuario.service.js', () => ({
  findUsuarioByEmail: jest.fn(),
  updateUsuario: jest.fn(),
}));

jest.unstable_mockModule('../src/utils/jwt.js', () => ({
  gerarToken: jest.fn().mockReturnValue('mocked_jwt_token'),
  verificarToken: jest.fn(),
}));

// Mock do Prisma (embora o controller importe, vamos mockar o service que ele usa)
jest.unstable_mockModule('../prisma/client.js', () => ({
  default: {}
}));


// Importa o controller DEPOIS dos mocks
const { loginUsuario } = await import('../src/controllers/usuario.controller.js');
const UsuarioService = await import('../src/services/usuario.service.js');

describe('Usuario Controller - Login', () => {

  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('Deve realizar login com sucesso para token válido e domínio correto', async () => {
    req.body.token = 'valid_token';

    UsuarioService.findUsuarioByEmail.mockResolvedValue({
      id: 1,
      email: 'test@seducbertioga.com.br',
      nome: 'Test User',
      role: 'ADMIN',
      picture: 'old_pic.jpg'
    });

    await loginUsuario(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: 'mocked_jwt_token',
      user: expect.objectContaining({ email: 'test@seducbertioga.com.br' })
    }));
  });

  test('Deve rejeitar domínio inválido', async () => {
    req.body.token = 'invalid_domain_token';

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Domínio não autorizado' });
  });

  test('Deve rejeitar se usuário não existir no banco', async () => {
    req.body.token = 'valid_token';
    UsuarioService.findUsuarioByEmail.mockResolvedValue(null);

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não autorizado' });
  });
});
