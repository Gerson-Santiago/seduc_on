import { validarUsuarioSED } from "./validarUsuario.service.js";

let cachedToken = null;
let tokenExpirationTime = 0;

// Buffer de segurança de 2 minutos antes de expirar para garantir que não usaremos um token prestes a vencer
const EXPIRATION_BUFFER_MS = 2 * 60 * 1000;
const TOKEN_VALIDITY_MS = 30 * 60 * 1000; // 30 minutos

/**
 * Obtém um token válido para a API SED.
 * Verifica se há um token em cache e se ele ainda é válido.
 * Se não, solicita um novo token via validarUsuarioSED.
 * @returns {Promise<string>} O token de acesso.
 */
export async function getTokenSED() {
    const now = Date.now();

    // Verifica se o token existe e se ainda não expirou (considerando o buffer)
    if (cachedToken && now < tokenExpirationTime) {
        return cachedToken;
    }

    console.log("[SED] Token expirado, inexistente ou próximo do vencimento. Solicitando novo...");

    try {
        const result = await validarUsuarioSED();

        if (result.error) {
            throw new Error(`Erro de negócio na SED: ${result.error}`);
        }

        if (!result.token) {
            throw new Error("API SED não retornou token nem erro explícito.");
        }

        cachedToken = result.token;
        // Define expiração para 30 min a partir de agora, menos o buffer
        tokenExpirationTime = now + TOKEN_VALIDITY_MS - EXPIRATION_BUFFER_MS;

        console.log(`[SED] Novo token armazenado. Válido até: ${new Date(tokenExpirationTime).toLocaleString('pt-BR')}`);

        return cachedToken;

    } catch (error) {
        console.error("[SED] Falha ao obter token:", error);
        // Em caso de erro, limpamos o cache para forçar nova tentativa na próxima vez
        clearToken();
        throw error;
    }
}

/**
 * Força a limpeza do token armazenado.
 * Útil em casos de erro 401/403 onde o token pode ter sido invalidado remotamente.
 */
export function clearToken() {
    cachedToken = null;
    tokenExpirationTime = 0;
    console.log("[SED] Token cache limpo.");
}
