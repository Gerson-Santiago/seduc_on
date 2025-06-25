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
  return environments[env];
};
