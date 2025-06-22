// frontend-aee-vite/vite.config.prod.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const baseURL = env.VITE_API_BASE_URL || 'http://localhost:3000'

  return {
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
  }
})


//   // Exemplo de uso do fetch para login
//   } catch (err) {
//     console.error('Erro ao fazer login:', err)
//     setError(err.message || 'Erro ao fazer login')
//   } finally {
//     setLoading(false)
//   }
//   }
//    