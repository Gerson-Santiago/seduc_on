// // /home/sant/aee/frontend-aee-vite/vite.config.js
// export default async function ({ mode }) {
//   if (mode === 'production') {
//     const mod = await import('./vite.config.prod.js');
//     return mod.default;
//   }
//   if (mode === 'preview') {
//     const mod = await import('./vite.config.preview.js');
//     return mod.default;
//   }
//   if (mode === 'github') {
//     const mod = await import('./vite.config.github.js');
//     return mod.default;
//   }
//   const mod = await import('./vite.config.dev.js');
//   return mod.default;
// }

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const isDev     = mode === 'development'
  const isPreview = mode === 'preview'

  return defineConfig({
    plugins: [react()],
    base: isDev ? '/' : env.VITE_BASE_URL,
    
    // dev server
    ...(isDev && {
      server: {
        port: Number(env.VITE_APP_PORT) || 5173,
        proxy: {
          '/api': {
            target: env.VITE_API_BASE_URL.replace(/\/api$/, ''),
            changeOrigin: true,
            secure: false,
            rewrite: p => p.replace(/^\/api/, '')
          }
        }
      }
    }),

    // preview server
    ...(isPreview && {
      preview: {
        port: Number(env.VITE_APP_PORT_PREVIEW) || 4173,
        host: true
      }
    }),

    define: {
      'import.meta.env.VITE_APP_URL':            JSON.stringify(env.VITE_APP_URL),
      'import.meta.env.VITE_API_BASE_URL':       JSON.stringify(env.VITE_API_BASE_URL),
      'import.meta.env.VITE_GOOGLE_REDIRECT_URI':JSON.stringify(env.VITE_GOOGLE_REDIRECT_URI),
      'import.meta.env.VITE_LOGIN_PATH':         JSON.stringify(env.VITE_LOGIN_PATH),
      'import.meta.env.VITE_DASHBOARD_PATH':     JSON.stringify(env.VITE_DASHBOARD_PATH)
    }
  })
}
