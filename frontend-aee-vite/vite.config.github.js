import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/aee/',
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_URL': JSON.stringify('https://gerson-santiago.github.io'),
    'import.meta.env.VITE_API_URL': JSON.stringify('https://sua-api-producao.com'),
    'import.meta.env.VITE_GOOGLE_REDIRECT_URI': JSON.stringify('https://gerson-santiago.github.io/aee/auth/callback'),
    'import.meta.env.VITE_LOGIN_PATH': JSON.stringify('/login'),
    'import.meta.env.VITE_DASHBOARD_PATH': JSON.stringify('/aee/dashboard2'),
  }
})
// Configuração para o modo de produção do Vite
// Esta configuração é usada para compilar o código para produção
