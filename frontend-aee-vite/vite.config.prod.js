// frontend-aee-vite/vite.config.prod.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const env = loadEnv('production', process.cwd())
const baseURL = env.VITE_API_BASE_URL || 'http://localhost:3000'

export default defineConfig({
  base: '/aee/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: baseURL,
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, ''),
      }
    }
  }
})
