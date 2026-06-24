import request from 'supertest';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// 1. Mock do Service DEVE ser definido antes de qualquer import que o use.
// "unstable_mockModule" é necessário para ESM.
jest.unstable_mockModule('../../src/services/aluno.service.js', () => ({
    createAluno: jest.fn(),
    updateAluno: jest.fn(),
    deleteAluno: jest.fn(), // Adicionado mock faltante
    findAllAlunos: jest.fn(),
}));

// 2. Import dinâmico do Módulo Mockado
const AlunoService = await import('../../src/services/aluno.service.js');

// 3. Import dinâmico da App (para garantir que ela carregue DEPOIS do mock)
const { default: app } = await import('../../src/app.js');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo-supersecreto';

describe('🔒 Security Offensive Tests (TDS)', () => {

    const tokenAdmin = jwt.sign({ id: 1, role: 'ADMIN', email: 'admin@b.com' }, JWT_SECRET);
    const tokenComum = jwt.sign({ id: 2, role: 'COMUM', email: 'user@b.com' }, JWT_SECRET);
    const tokenInvalido = 'token.mal.formado'; // Keep this for potential future tests

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('1. Role Bypass (Broken Access Control)', () => {
        test('DEVE BLOQUEAR usuário COMUM tentando CRIAR aluno (Esperado: 403)', async () => {
            AlunoService.createAluno.mockResolvedValue({ ra: '123' });

            const res = await request(app)
                .post('/api/alunos')
                .set('Authorization', `Bearer ${tokenComum}`)
                .send({ ra: '123', nome_aluno: 'Hacker', nome_escola: 'Escola X' });

            expect(res.status).toBe(403);
        });

        test('DEVE BLOQUEAR acesso sem token (Esperado: 401)', async () => {
            const res = await request(app).get('/api/alunos');
            expect(res.status).toBe(401);
        });

        test('DEVE BLOQUEAR acesso com token INVÁLIDO/FORJADO (Esperado: 401)', async () => {
            const res = await request(app)
                .get('/api/alunos')
                .set('Authorization', `Bearer ${tokenInvalido}`);

            expect(res.status).toBe(401);
        });
    });

    describe('2. Mass Assignment (Dados Indesejados)', () => {
        // DECISÃO ARQUITETURAL: Este teste é pulado propositalmente neste contexto.
        //
        // A validação Zod está no Service. Ao mockarmos o Service inteiro aqui,
        // removemos a própria proteção que o teste deveria verificar — gerando um
        // falso negativo (o teste acusaria vulnerabilidade que não existe em produção).
        //
        // A cobertura correta para Mass Assignment é feita nos testes unitários do
        // Service (com Prisma mockado mas lógica Zod real), não aqui.
        //
        // Referência: tests/controllers/usuario.controller.crud.test.js (validação no service)
        test.skip('DEVE REJEITAR campos não permitidos no payload (Esperado: Service receber dados limpos)', () => {
            // Skipped — ver comentário no describe acima.
        });
    });

    describe('3. IDOR (Insecure Direct Object Reference)', () => {
        test('Usuario COMUM não deve conseguir DELETAR aluno (Esperado: 403)', async () => {
            // Mock do delete
            AlunoService.deleteAluno.mockResolvedValue({});

            const res = await request(app)
                .delete('/api/alunos/123')
                .set('Authorization', `Bearer ${tokenComum}`);

            expect(res.status).toBe(403);
        });
    });

});
