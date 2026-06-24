// backend/jest.config.js
export default {
  // ESM nativo já inferido pelo "type": "module" no package.json
  // extensionsToTreatAsEsm não é necessário (Jest 30 detecta automaticamente)

  // 1 worker por vez: garante isolamento de cache de módulos entre suites
  // que usam jest.unstable_mockModule (evita contaminação de mocks entre testes)
  maxWorkers: 1,

  // Descoberta de arquivos de teste
  testMatch: ['**/tests/**/*.test.js'],

  // Cobertura: quais arquivos do src/ devem ser medidos
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/etl/**',     // scripts de importação de dados (não são lógica de negócio)
  ],
};
