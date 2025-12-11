import { jest } from '@jest/globals';
import winston from 'winston';
import { sensitiveDataRedactor } from '../../src/utils/logger.js';

describe('Secure Logger Redaction', () => {
    // O sensitiveDataRedactor é um winston format.
    // Ele retorna um objeto { transform: function(info, opts) }
    // Precisamos instanciar o format e chamar transform.

    const format = sensitiveDataRedactor();

    test('Deve ofuscar chaves exatas (password, token)', () => {
        const info = {
            level: 'info',
            message: 'teste',
            password: 'secret_password',
            token: 'secret_token'
        };

        const result = format.transform(info);

        expect(result.password).toBe('***REDACTED***');
        expect(result.token).toBe('***REDACTED***');
        expect(result.message).toBe('teste');
    });

    test('Deve ofuscar e-mail parcialmente', () => {
        const info = {
            level: 'info',
            email: 'usuario@dominio.com'
        };

        const result = format.transform(info);

        // Esperado: u*****@dominio.com
        expect(result.email).toBe('u*****@dominio.com');
    });

    test('Deve ofuscar objetos aninhados', () => {
        const info = {
            level: 'info',
            body: {
                user: {
                    name: 'Gerson',
                    senha: '123'
                }
            }
        };

        const result = format.transform(info);

        expect(result.body.user.senha).toBe('***REDACTED***');
        expect(result.body.user.name).toBe('Gerson');
    });

    test('Deve ofuscar headers de autorização', () => {
        const info = {
            level: 'info',
            headers: {
                authorization: 'Bearer token_secreto'
            }
        };
        const result = format.transform(info);
        expect(result.headers.authorization).toBe('***REDACTED***');
    });
});
