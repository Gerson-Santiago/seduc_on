import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const baseURL = env.VITE_API_BASE_URL || 'http://localhost:3000'

  return {
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
//   } catch (err) {
//     console.error('Erro ao fazer login:', err)
//     setError(err.message || 'Erro ao fazer login')
//   } finally {
//     setLoading(false)
//   }
//   }
//    