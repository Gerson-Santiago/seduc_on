//frontend-aee-vite/src/api/auth.jsx
import { BASE_URL } from './index';

export const loginUsuario = async (token) => {
  const response = await fetch(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || 'Usuário não autorizado');
  }

  return response.json();
};

export const validarSessao = async (token) => {
  const response = await fetch(`${BASE_URL}/usuarios/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Sessão inválida');

  return response.json();
};
