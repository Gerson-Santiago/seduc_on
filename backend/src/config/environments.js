// src/config/environments.js

const environments = {
  development: {
    FRONTEND_URL: 'http://localhost:5173',
    ALLOWED_ORIGINS: ['http://localhost:5173'],
    GOOGLE_REDIRECT_URI: 'http://localhost:5173/aee/auth/callback'
  },
  preview: {
    FRONTEND_URL: 'http://localhost:4173',
    ALLOWED_ORIGINS: ['http://localhost:4173'],
    GOOGLE_REDIRECT_URI: 'http://localhost:4173/aee/auth/callback'
  },
  github: {
    FRONTEND_URL: 'https://gerson-santiago.github.io/aee',
    ALLOWED_ORIGINS: ['https://gerson-santiago.github.io'],
    GOOGLE_REDIRECT_URI: 'https://gerson-santiago.github.io/aee/auth/callback'
  },
  production: {
    FRONTEND_URL: 'https://seudominio.com/aee',
    ALLOWED_ORIGINS: ['https://seudominio.com'],
    GOOGLE_REDIRECT_URI: 'https://seudominio.com/aee/auth/callback'
  }
};

export const getBackendConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const defaultConfig = environments[env];

  // LÓGICA DE OURO: Prioriza o .env, usa o código como fallback
  const frontendUrl = process.env.FRONTEND_URL || defaultConfig.FRONTEND_URL;

  // Trata ALLOWED_ORIGINS (se vier do .env é string separada por vírgula, se vier do js é array)
  let allowedOrigins = defaultConfig.ALLOWED_ORIGINS;
  if (process.env.ALLOWED_ORIGINS) {
    allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
  }

  return {
    ...defaultConfig,
    FRONTEND_URL: frontendUrl,
    ALLOWED_ORIGINS: allowedOrigins,
    // Se quiser que o redirect também venha do .env:
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || defaultConfig.GOOGLE_REDIRECT_URI
  };
};