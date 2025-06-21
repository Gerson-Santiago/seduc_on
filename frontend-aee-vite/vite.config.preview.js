// frontend-aee-vite/vite.config.preview.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    port: 4173,
    host: true
  },
  base: '/aee/', // importante para simular GitHub Pages
  define: {
    'import.meta.env.VITE_APP_URL': JSON.stringify('http://localhost:4173'),
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:3000'),
    'import.meta.env.VITE_GOOGLE_REDIRECT_URI': JSON.stringify('http://localhost:4173/aee/auth/callback'),
    'import.meta.env.VITE_LOGIN_PATH': JSON.stringify('/aee/login'),
    'import.meta.env.VITE_DASHBOARD_PATH': JSON.stringify('/aee/dashboard2')
  }
})
// Configuração para o modo de preview do Vite
// Esta configuração é usada para simular o ambiente de produção durante o preview
// O servidor de preview roda na porta 4173 e permite acesso externo
// A base é definida para '/aee/' para simular o comportamento do GitHub Pages
// As variáveis de ambiente são definidas para corresponder ao ambiente de produção
// O plugin React é usado para compilar o código React
// O servidor de preview é configurado para permitir acesso externo e rodar na porta 4173
// O base é definido para '/aee/' para simular o comportamento do GitHub Pages