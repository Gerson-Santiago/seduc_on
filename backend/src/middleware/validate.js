import { z } from 'zod';

/**
 * Middleware para validar dados da requisição com Zod
 * @param {z.ZodSchema} schema - Schema do Zod para validação
 * @param {'body'|'query'|'params'} source - Parte da requisição a ser validada (default: 'body')
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
    try {
        const data = req[source];
        const validData = schema.parse(data);

        // Substitui os dados da requisição pelos dados validados (e transformados, se houver)
        req[source] = validData;

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const details = error.errors ? error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            })) : [{ message: error.message }];

            return res.status(400).json({
                error: 'Validation Error',
                details
            });
        }
        next(error);
    }
};
