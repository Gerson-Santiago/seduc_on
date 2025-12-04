// backend/tests/aluno.stats.test.js

import { jest } from '@jest/globals';

// Mock do Prisma
const mockPrisma = {
    alunos_regular_ei_ef9: {
        groupBy: jest.fn(),
    }
};

// Importa o serviço
const { getStats } = await import('../../src/services/aluno.service.js');

describe('Aluno Service - Stats', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Deve calcular estatísticas globais corretamente', async () => {
        // Setup
        mockPrisma.alunos_regular_ei_ef9.groupBy.mockResolvedValueOnce([
            { filtro_serie: '1 ANO', _count: { ra: 10 } },
            { filtro_serie: 'BERÇARIO 1', _count: { ra: 5 } },
            { filtro_serie: 'MATERNAL 2', _count: { ra: 8 } },
        ]) // Primeiro groupBy (Global)
            .mockResolvedValueOnce([]); // Segundo groupBy (Escolas - não testado aqui em detalhe)

        // Execute
        const result = await getStats(mockPrisma);

        // Verify
        expect(result.global.ano_1).toBe(10);
        expect(result.global.bercario_1).toBe(5);
        expect(result.global.maternal_2).toBe(8);
        expect(result.global.ano_5).toBe(0); // Default
    });

    test('Deve retornar zeros se não houver dados', async () => {
        mockPrisma.alunos_regular_ei_ef9.groupBy.mockResolvedValue([]);

        const result = await getStats(mockPrisma);

        expect(result.global.ano_1).toBe(0);
        expect(result.global.bercario_1).toBe(0);
    });
});
