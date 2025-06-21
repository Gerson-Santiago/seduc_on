// frontend-aee-vite/vite.config.dev.js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig(({ command, mode }) => {
  if (mode === 'production') {
    return import('./vite.config.prod.js').then(m => m.default)
  } else if (mode === 'preview') {
    return import('./vite.config.preview.js').then(m => m.default)
  } else if (mode === 'github') {
    return import('./vite.config.github.js').then(m => m.default)
  } else {
    return import('./vite.config.dev.js').then(m => m.default)
  }
})
