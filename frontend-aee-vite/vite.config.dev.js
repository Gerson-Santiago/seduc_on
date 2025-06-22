// frontend-aee-vite/vite.config.dev.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // @backendlocal
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  define: {
    'import.meta.env.VITE_APP_URL': JSON.stringify('http://localhost:5173'),
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:3000'),
    'import.meta.env.VITE_GOOGLE_REDIRECT_URI': JSON.stringify('http://localhost:5173/aee/auth/callback'),
    'import.meta.env.VITE_LOGIN_PATH': JSON.stringify('/login'),
    'import.meta.env.VITE_DASHBOARD_PATH': JSON.stringify('/aee/dashboard2')
  }
})
