// frontend-aee-vite/src/api/index.jsx

// Variáveis de ambiente
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_BASE_URL = `${baseURL}/api`;

// // Rotas organizadas
// export const API_ROUTES = {
//   login: `${API_BASE_URL}/usuarios/login`,
//   me: `${API_BASE_URL}/usuarios/me`,
//   logout: `${API_BASE_URL}/usuarios/logout`,
//   usuarios: `${API_BASE_URL}/usuarios`,
// };

// // Utilitário com token
// export const fetchWithAuth = async (url, options = {}) => {
//   const tokenData = localStorage.getItem('aee_user');
//   const token = tokenData ? JSON.parse(tokenData).token : null;

//   if (token) {
//     options.headers = {
//       ...options.headers,
//       Authorization: `Bearer ${token}`,
//     };
//   }

//   const response = await fetch(url, options);
//   if (!response.ok) throw new Error(`Erro ao acessar ${url}: ${response.statusText}`);
//   return response.json();
// };

// // Funções principais
// export const login = async (credential) => {
//   const res = await fetch(API_ROUTES.login, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ token: credential }),
//   });
//   if (!res.ok) throw new Error((await res.json()).message || 'Usuário não autorizado');
//   return res.json();
// };

// export const getCurrentUser = () => fetchWithAuth(API_ROUTES.me);
// export const logout = async () => {
//   await fetchWithAuth(API_ROUTES.logout, { method: 'POST' });
//   localStorage.removeItem('aee_user');
// };
// export const getUsuarios = () => fetchWithAuth(API_ROUTES.usuarios);
// export const createUsuario = (data) =>
//   fetchWithAuth(API_ROUTES.usuarios, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
// export const updateUsuario = (id, data) =>
//   fetchWithAuth(`${API_ROUTES.usuarios}/${id}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
// export const deleteUsuario = (id) =>
//   fetchWithAuth(`${API_ROUTES.usuarios}/${id}`, { method: 'DELETE' });
// export const getUsuarioById = (id) => fetchWithAuth(`${API_ROUTES.usuarios}/${id}`);
// export const searchUsuarios = (query) => {
//   const url = new URL(API_ROUTES.usuarios);
//   if (query) url.searchParams.append('q', query);
//   return fetchWithAuth(url.toString());
// };

// // Utilitários para ambiente
// export const getEnv = () => ({
//   GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'Não definido',
//   API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'Não definido',
//   APP_MODE: import.meta.env.VITE_APP_MODE || 'Não definido',
// });
