// /home/sant/aee/server.js
import 'dotenv/config';
import app from './src/app.js';
import { getBackendConfig } from './src/config/environments.js';

const env = process.env.NODE_ENV || 'development';

console.log('🔥 NODE_ENV:', env);
console.log('🔥 Config backend:', getBackendConfig());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em modo ${env} na porta http://localhost:${PORT}`);
});
