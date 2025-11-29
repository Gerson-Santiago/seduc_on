// backend/src/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// Limitador geral para a API
// 100 requisições por 15 minutos
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
    standardHeaders: true, // Retorna info de rate limit nos headers `RateLimit-*`
    legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
    message: {
        status: 429,
        error: 'Too Many Requests',
        message: 'Muitas requisições deste IP, por favor tente novamente após 15 minutos.'
    }
});

// Limitador mais estrito para Login (futuro uso)
export const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // 5 tentativas de login por hora
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: 'Too Many Requests',
        message: 'Muitas tentativas de login. Tente novamente após 1 hora.'
    }
});
