// vite.config.github.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/aee/', // nome do repositório
  plugins: [react()],
});
