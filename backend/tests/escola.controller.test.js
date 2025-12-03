import { jest } from '@jest/globals';

// Import dinâmico do módulo testado
const { listarEscolas, getStats } = await import('../src/controllers/escola.controller.js');

describe('Escola Controller', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            params: {},
            query: {},
            prisma: {
                dados_das_escolas: {
                    findMany: jest.fn()
                },
                $queryRaw: jest.fn()
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('listarEscolas', () => {
        test('Deve retornar lista de escolas com status 200', async () => {
            const mockEscolas = [{ id: 1, nome: 'Escola A' }, { id: 2, nome: 'Escola B' }];
            req.prisma.dados_das_escolas.findMany.mockResolvedValue(mockEscolas);

            await listarEscolas(req, res);

            expect(res.json).toHaveBeenCalledWith(mockEscolas);
            expect(req.prisma.dados_das_escolas.findMany).toHaveBeenCalled();
        });

        test('Deve chamar next com erro se o banco falhar', async () => {
            const next = jest.fn();
            const erro = new Error('Erro interno');
            req.prisma.dados_das_escolas.findMany.mockRejectedValue(erro);

            await listarEscolas(req, res, next);

            expect(next).toHaveBeenCalledWith(erro);
        });
    });

    describe('getStats', () => {
        test('Deve retornar estatísticas formatadas corretamente', async () => {
            const mockQueryRaw = [
                { categoria: 'bercario', total: 10n },
                { categoria: 'ano1', total: 20n }
            ];
            req.prisma.$queryRaw.mockResolvedValue(mockQueryRaw);

            await getStats(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                bercario: 10,
                ano1: 20,
                ano5: 0 // Default value
            }));
        });

        test('Deve chamar next com erro se a query falhar', async () => {
            const next = jest.fn();
            const erro = new Error('Erro na query');
            req.prisma.$queryRaw.mockRejectedValue(erro);

            await getStats(req, res, next);

            expect(next).toHaveBeenCalledWith(erro);
        });
    });
});
