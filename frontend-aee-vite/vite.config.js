// ===================================
// VITE CONFIGURAÇÃO UNIFICADA PARA DIFERENTES AMBIENTES
// ===================================
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  // Carrega variáveis de ambiente do .env.<mode>
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  const isDev     = mode === 'development'  // npm run dev
  const isPreview = mode === 'preview'      // npm run preview
  const isGithub  = mode === 'github'       // npm run build:github
  const isProd    = mode === 'production'   // npm run build:prod

  return defineConfig({
    plugins: [react()],

    // ===================================
    // PATH BASE
    // - '/' em dev (raiz)
    // - VITE_BASE_URL nos demais (ex: '/aee/')
    // ===================================
    base: isDev ? '/' : env.VITE_BASE_URL,

    // ===================================
    // SERVIDOR DE DESENVOLVIMENTO (vite --mode development)
    // - proxy /api para backend local (remove /api do target)
    // ===================================
    ...(isDev && {
      server: {
        host: true,
        port: Number(env.VITE_APP_PORT) || 5173,
        proxy: {
          '/api': {
            target: env.VITE_API_BASE_URL.replace(/\/api$/, ''),
            changeOrigin: true,
            secure: false,
            rewrite: path => path.replace(/^\/api/, '')
          }
        }
      }
    }),

    // ===================================
    // SERVIDOR DE PREVIEW (vite preview --mode preview)
    // - simula GitHub Pages em /aee/ localmente
    // ===================================
    ...(isPreview && {
      preview: {
        host: true,
        port: Number(env.VITE_APP_PORT_PREVIEW) || 4173,
      }
    }),

    // ===================================
    // GITHUB / PRODUCTION BUILD
    // - sem servidor local, apenas gera arquivos estáticos
    // ===================================
    ...((isGithub || isProd) ? {} : {}),

    // ===================================
    // INJEÇÃO DE VARIÁVEIS EM import.meta.env
    // ===================================
    define: {
      'import.meta.env.VITE_APP_URL':             JSON.stringify(env.VITE_APP_URL),
      'import.meta.env.VITE_API_BASE_URL':        JSON.stringify(env.VITE_API_BASE_URL),
      'import.meta.env.VITE_GOOGLE_REDIRECT_URI': JSON.stringify(env.VITE_GOOGLE_REDIRECT_URI),
      'import.meta.env.VITE_LOGIN_PATH':          JSON.stringify(env.VITE_LOGIN_PATH),
      'import.meta.env.VITE_DASHBOARD_PATH':      JSON.stringify(env.VITE_DASHBOARD_PATH),
    }
  })
}
