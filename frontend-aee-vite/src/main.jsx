import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Contextos e Rotas
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

// Estilos Globais (Mantenha a ordem para a cascata funcionar)
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';

// Configuração do Google
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AuthProvider>
          {/* Substituímos o <App /> antigo pelo novo sistema de rotas */}
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);