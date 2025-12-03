/**
 * Wrapper para funções assíncronas do Express.
 * Elimina a necessidade de try-catch em cada controller.
 * @param {Function} fn - Função do controller (req, res, next)
 */
export const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
