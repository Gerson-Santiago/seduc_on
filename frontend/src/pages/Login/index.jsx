// frontend/src/pages/Login/index.jsx
import React from 'react';
import logoPrefeitura from '../../assets/logo-prefeitura.png'; // Caminho corrigido
import { useAuth } from '../../context/AuthContext';           // Caminho corrigido
import './Login.css';

export default function Login() {
  // Usamos a função loginRedirect que vem do seu Contexto, como na versão antiga
  const { loginRedirect } = useAuth();

  return (
    <div className="login-page">
      <header className="login-header">
        <img src={logoPrefeitura} alt="Prefeitura de Bertioga" className="logo-prefeitura" />
      </header>

      <div className="login-container">
        <div className="login-card">
          <h1>Bem-vindo ao AEE</h1>
          <p>Faça login com sua conta <strong>@seducbertioga.com.br</strong></p>

          {/* Botão idêntico ao original, usando a imagem externa do Google */}
          <button onClick={loginRedirect} className="google-login-button">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
            />
            <span>Entrar com Google</span>
          </button>

          {/* Link para solicitar acesso (mantendo a funcionalidade nova de navegação) */}
          <div className="login-footer">
            <a href="/solicitar-acesso">Não tem acesso? Solicite aqui</a>
          </div>
        </div>
      </div>
    </div>
  );
}