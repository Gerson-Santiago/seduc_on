import { jest } from '@jest/globals';

// Mock Prisma Client BEFORE importing app using unstable_mockModule for ESM
const mockPrisma = {
    access_requests: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
};

jest.unstable_mockModule('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockPrisma),
}));

// Dynamic imports are required after unstable_mockModule
const { default: app } = await import('../src/app.js');
const { default: request } = await import('supertest');

describe('Access Requests API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new access request with valid data', async () => {
        const validData = {
            nome_completo: 'Test User',
            registro_funcional: '12345',
            contador_registro_funcional: '1',
            cargo: 'Professor',
            setor: 'Escola A',
            email: 'test.user@seducbertioga.com.br',
        };

        mockPrisma.access_requests.create.mockResolvedValue({
            id: 1,
            status: 'pendente',
            ...validData,
            registro_funcional: 12345,
            contador_registro_funcional: 1
        });

        const res = await request(app)
            .post('/api/access-requests')
            .send(validData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(mockPrisma.access_requests.create).toHaveBeenCalledWith({
            data: {
                nome_completo: validData.nome_completo,
                registro_funcional: 12345,
                contador_registro_funcional: 1,
                cargo: validData.cargo,
                setor: validData.setor,
                email: validData.email,
            },
        });
    });

    it('should handle missing contador_registro_funcional by defaulting to 1', async () => {
        const dataWithoutContador = {
            nome_completo: 'Test User 2',
            registro_funcional: '67890',
            // contador missing
            cargo: 'Diretor',
            setor: 'Escola B',
            email: 'test.user2@seducbertioga.com.br',
        };

        mockPrisma.access_requests.create.mockResolvedValue({
            id: 2,
            status: 'pendente',
            ...dataWithoutContador,
            registro_funcional: 67890,
            contador_registro_funcional: 1
        });

        const res = await request(app)
            .post('/api/access-requests')
            .send(dataWithoutContador);

        expect(res.statusCode).toEqual(201);
        expect(mockPrisma.access_requests.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                registro_funcional: 67890,
                contador_registro_funcional: 1, // Default value
            }),
        });
    });

    it('should reject invalid email domain', async () => {
        const invalidData = {
            nome_completo: 'Hacker',
            registro_funcional: '99999',
            email: 'hacker@gmail.com',
        };

        const res = await request(app)
            .post('/api/access-requests')
            .send(invalidData);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/E-mail deve terminar com/);
        expect(mockPrisma.access_requests.create).not.toHaveBeenCalled();
    });
});
