// ~/aee/backend/prisma.config.js

/**
 * Arquivo de configuração do Prisma. Usa sintaxe CommonJS (module.exports)
 * para garantir compatibilidade com o Prisma CLI.
 *
 * @type {import('@prisma/cli').PrismaConfig}
 */
const config = {
    // Move a configuração do script seed para cá
    seed: 'node prisma/seed.js',
};

module.exports = config;