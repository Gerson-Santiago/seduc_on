import { jest } from '@jest/globals';
import { z } from 'zod';
import { validate } from '../src/middleware/validate.js';

describe('Middleware de Validação', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    const schema = z.object({
        nome: z.string().min(3),
        idade: z.number().optional()
    });

    test('Deve chamar next() se os dados forem válidos', () => {
        req.body = { nome: 'Teste', idade: 20 };

        validate(schema)(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test('Deve retornar 400 se os dados forem inválidos', () => {
        req.body = { nome: 'A' }; // Nome muito curto

        validate(schema)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: 'Validation Error'
        }));
        expect(next).not.toHaveBeenCalled();
    });

    test('Deve validar query params se especificado', () => {
        req.query = { nome: 'Teste' };

        validate(schema, 'query')(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
