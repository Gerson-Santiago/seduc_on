import { verificarToken as verifyJwt } from '../utils/jwt.js';

/**
 * Middleware de Autenticação Híbrido
 * Suporta:
 * 1. API Key (Header: x-api-key) -> Para testes e scripts
 * 2. JWT (Header: Authorization) -> Para usuários logados
 */
export function verificarToken(req, res, next) {
    // 1. Verificação via API Key (Prioridade para scripts/testes)
    const apiKey = req.headers['x-api-key'];
    const envApiKey = process.env.TEST_API_KEY;

    if (apiKey && envApiKey) {
        if (apiKey === envApiKey) {
            // Acesso concedido via API Key
            req.user = { id: 'system-test', role: 'ADMIN', type: 'api-key' };
            return next();
        } else {
            return res.status(401).json({ error: 'API Key inválida' });
        }
    }

    // 2. Verificação via Token JWT (Usuário Padrão)
    // PRIORIDADE: Cookie HttpOnly (Novo Padrão Seguro)
    let token = req.cookies?.token;

    // FALLBACK: Header Authorization (Para compatibilidade ou clientes sem cookie)
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const payload = verifyJwt(token);
    if (!payload) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Acesso concedido via JWT
    req.user = payload;
    next();
}

export function verificarAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado. Requer perfil ADMIN.' });
    }
    next();
}
