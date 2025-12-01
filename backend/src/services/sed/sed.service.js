import { getTokenSED, clearToken } from "./salvartoken30.service.js";
import { validarUsuarioSED } from "./validarUsuario.service.js";

export const sedService = {
    /**
     * Obtém um token de acesso válido.
     * Gerencia automaticamente o cache e renovação a cada 30 minutos.
     * @returns {Promise<string>} Token de acesso
     */
    getToken: getTokenSED,

    /**
     * Força a limpeza do token local.
     * Deve ser chamado se uma requisição retornar 401/403.
     */
    clearToken: clearToken,

    /**
     * Realiza a validação direta (sem cache).
     * Útil para debug ou health check.
     * @returns {Promise<{token: string, usuario: string, error: string, processoId: number}>}
     */
    validarUsuario: validarUsuarioSED
};
