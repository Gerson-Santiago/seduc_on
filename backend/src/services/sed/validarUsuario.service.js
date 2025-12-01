// /home/sant/seduc_on/backend/src/services/sed/validarUsuario.service.js
import fetch from "node-fetch";

const LOGIN_SED = process.env.LOGIN_SED || process.env.LOGIN_AUTH_SED;     // usuário fornecido pela SED
const SED_AUTH = process.env.SED_AUTH;       // senha fornecida pela SED
const URL_VALIDASED = process.env.URL_VALIDASED; // ex: https://homologacaointegracaosed.educacao.sp.gov.br/ncaapi/api

/**
 * Realiza a chamada à API SED para validar o usuário e obter o token.
 * @returns {Promise<{token: string, usuario: string, error: string, processoId: number}>}
 */
export async function validarUsuarioSED() {
    if (!LOGIN_SED || !SED_AUTH || !URL_VALIDASED) {
        throw new Error("Credenciais ou URL da SED não configuradas no ambiente (.env)");
    }

    try {
        const tokenBasic = Buffer
            .from(`${LOGIN_SED}:${SED_AUTH}`)
            .toString("base64");

        console.log(`[SED] Tentando validar usuário em: ${URL_VALIDASED}/Usuario/ValidarUsuario`);

        const response = await fetch(
            `${URL_VALIDASED}/Usuario/ValidarUsuario`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Basic ${tokenBasic}`,
                    "Content-Type": "application/json; charset=UTF-8"
                }
            }
        );

        const data = await response.json();

        // Mapeando retorno conforme documentação
        const result = {
            token: data.outAutenticacao,
            usuario: data.outUsuario,
            error: data.outErro,
            processoId: data.outProcessoID,
            raw: data // Mantendo o dado original para debug se necessário
        };

        if (response.status === 200) {
            if (result.error) {
                console.warn(`[SED] Validação retornou 200 mas com erro de negócio: ${result.error}`);
            } else if (result.token) {
                console.log(`[SED] Usuário validado com sucesso. Token obtido.`);
            }
        } else {
            console.error(`[SED] Falha na requisição: Status ${response.status}`);
        }

        return result;

    } catch (error) {
        console.error("[SED] Erro interno ao conectar na API:", error);
        throw error;
    }
}
