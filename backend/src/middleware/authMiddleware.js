import { verificarToken } from '../utils/jwt.js';

/**
 * Middleware de Autenticação Híbrido
 * Suporta:
 * 1. API Key (Header: x-api-key) -> Para testes e scripts
 * 2. JWT (Header: Authorization) -> Para usuários logados
 */
export function authMiddleware(req, res, next) {
    // 1. Verificação via API Key (Prioridade para scripts/testes)
    const apiKey = req.headers['x-api-key'];
    const envApiKey = process.env.TEST_API_KEY;

    if (apiKey && envApiKey) {
        if (apiKey === envApiKey) {
            // Acesso concedido via API Key
            req.user = { id: 'system-test', role: 'admin', type: 'api-key' };
            return next();
        } else {
            return res.status(401).json({ error: 'API Key inválida' });
        }
    }

    // 2. Verificação via Token JWT (Usuário Padrão)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const payload = verificarToken(token);
    if (!payload) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Acesso concedido via JWT
    req.user = payload;
    next();
}
