/**
 * @file formatters.js
 * @description Funções utilitárias compartilhadas para formatação e sanitização de dados.
 * Utilizado tanto pela API (Services) quanto pelos scripts de ETL.
 */

/**
 * Converte string de data formato DD/MM/YYYY para objeto Date do Javascript.
 * @param {string} dataStr - String de data (ex: "31/12/2023")
 * @returns {Date|null} Objeto Date ou null se inválido
 */
export const converterData = (dataStr) => {
    if (!dataStr || typeof dataStr !== 'string' || dataStr.trim() === '') return null;
    const partes = dataStr.trim().split('/');
    if (partes.length !== 3) return null;

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const ano = parseInt(partes[2], 10);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;
    if (ano < 1900 || ano > 2100) return null; // Verificação de sanidade
    if (mes < 1 || mes > 12) return null; // Validação estrita de mês

    // new Date(ano, mesIndex, dia) - mês é indexado em 0
    const data = new Date(ano, mes - 1, dia);

    // Verifica overflow de dias (ex: 31/02 vira 02/03 ou 03/03)
    if (data.getDate() !== dia || data.getMonth() !== mes - 1 || data.getFullYear() !== ano) {
        return null;
    }

    if (isNaN(data.getTime())) return null;
    return data;
};

/**
 * Converte string para inteiro de forma segura, retornando null se NaN.
 * @param {string|number} val - Valor a ser convertido
 * @returns {number|null} Inteiro ou null
 */
export const converterIntSeguro = (val) => {
    if (!val) return null;
    const processado = parseInt(val, 10);
    return isNaN(processado) ? null : processado;
}

/**
 * Remove espaços em branco do início/fim e substitui múltiplos espaços internos por um único.
 * @param {string} texto - String a ser limpa
 * @returns {string|null} String limpa ou null se vazia
 */
export const sanitizarTexto = (texto) => {
    if (!texto) return null;
    if (typeof texto !== 'string') return String(texto);

    const textoLimpo = texto.trim().replace(/\s+/g, ' ');
    return textoLimpo === '' ? null : textoLimpo;
}
