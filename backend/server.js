import { resolve } from 'path';
import * as dotenv from 'dotenv';
import app from './src/app.js';
import { getBackendConfig } from './src/config/environments.js';

// 1. Determina o ambiente
const env = process.env.NODE_ENV || 'development';

// 2. Define o caminho do arquivo de ambiente (.env.dev ou .env.preview)
const envFile = env === 'preview' ? `.env.preview` : `.env.dev`;

// 3. Carrega o arquivo de ambiente (CORREÇÃO CRÍTICA)
// Garante que o arquivo correto seja lido (usamos o .env.preview se o NODE_ENV for preview)
dotenv.config({ path: resolve(process.cwd(), envFile) });

// 4. Verificação de DEBUG: Confirma se o CLIENT_ID foi lido.
const CLIENT_ID_CHECK = process.env.GOOGLE_CLIENT_ID;

console.log(`[ENV DEBUG] Arquivo lido: ${envFile}`);
console.log(`[ENV DEBUG] CLIENT_ID lido: ${CLIENT_ID_CHECK ? 'SIM' : 'NÃO'}`);

// 5. Verificação de Falha Crítica: Se a variável mais importante não for lida, o servidor para.
if (!CLIENT_ID_CHECK) {
  console.error("🔴 ERRO CRÍTICO: GOOGLE_CLIENT_ID não foi carregado.");
  console.error(`Verifique se o arquivo ${envFile} existe no diretório 'backend/' e se contém a variável.`);
  process.exit(1);
}

// O restante do código de inicialização
console.log('🔥 NODE_ENV:', env);
console.log('🔥 Config backend:', getBackendConfig());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em modo ${env} na porta http://localhost:${PORT}`);
});