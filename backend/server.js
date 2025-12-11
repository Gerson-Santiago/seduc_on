// backend/server.js
// ============================
// Inicialização com Node Native Env (--env-file)
// ============================

import app from './src/app.js';
import { getBackendConfig } from './src/config/environments.js';

// NOTA: Não importamos mais 'dotenv' aqui.
// As variáveis já foram injetadas pelo comando no package.json

// 1. Verificações de Segurança
const CLIENT_ID_CHECK = process.env.GOOGLE_CLIENT_ID;
const ENV_CHECK = process.env.NODE_ENV;

// Log de inicialização
console.log('=====================================');
console.log(`🔥 Modo Detectado: ${ENV_CHECK || 'Indefinido'}`);
console.log(`📂 Carregamento de Variáveis: Nativo (--env-file)`);

if (!CLIENT_ID_CHECK) {
  console.error("🔴 ERRO CRÍTICO: GOOGLE_CLIENT_ID não foi carregado.");
  console.error("Verifique se o arquivo .env correto foi passado no script de inicialização.");
  process.exit(1);
} else {
  console.log(`✅ CLIENT_ID lido com sucesso.`);
}

// 2. Configuração
const config = getBackendConfig();
console.log('🔥 Configurações Ativas:', {
  Front: config.FRONTEND_URL,
  Origins: config.ALLOWED_ORIGINS,
  Redirect: config.GOOGLE_REDIRECT_URI
});

// 3. Iniciar Servidor
const PORT = process.env.PORT || 3000;

// Validate critical environment variables
const REQUIRED_ENV = ['JWT_SECRET', 'GOOGLE_CLIENT_ID', 'DATABASE_URL'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', `FATAL ERROR: Missing required environment variables: ${missingEnv.join(', ')}`);
  console.error('Please configure them in your .env file.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔥 Environment: ${process.env.NODE_ENV}`);
});