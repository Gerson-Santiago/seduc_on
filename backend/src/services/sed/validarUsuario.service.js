// /home/sant/seduc_on/backend/src/services/sed/validarUsuario.service.js
import fetch from "node-fetch";

const LOGIN_SED = process.env.LOGIN_SED;     // usuário fornecido pela SED
const SED_AUTH = process.env.SED_AUTH;       // senha fornecida pela SED
const URL_VALIDASED = process.env.URL_VALIDASED; // ex: https://homologacaointegracaosed.educacao.sp.gov.br/ncaapi/api

export async function validarUsuarioSED() {
    try {
        const tokenBasic = Buffer
            .from(`${LOGIN_SED}:${SED_AUTH}`)
            .toString("base64");

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

        return { status: response.status, data };

    } catch (error) {
        console.error("Erro SED:", error);
        throw error;
    }
}
