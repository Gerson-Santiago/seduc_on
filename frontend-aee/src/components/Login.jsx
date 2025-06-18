import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import logoPrefeitura from '../assets/logo-prefeitura.png';
import logoSistema from '../assets/logo-sistema.png';
import './Login.css';

export default function Login({ onLoginSuccess, onLoginError, loginErro }) {
  return (
    <div className="login-page">
      <header className="login-header">
        <img src={logoPrefeitura} alt="Prefeitura de Bertioga" className="logo-prefeitura" />
        
        {/* 
        Este é um comentário de uma linha 
        <img src={logoSistema}    alt="Sistema AEE"             className="logo-sistema" />
        */}
      </header>

      <div className="login-container">
        <div className="login-card">
          <h1>Bem-vindo ao AEE</h1>
          <p>Faça login com sua conta <strong>@seducbertioga.com.br</strong></p>
          <div className="google-button">
            <GoogleLogin
              onSuccess={onLoginSuccess}
              onError={onLoginError}
              useOneTap
              shape="rectangular"
              theme="filled_blue"
              size="large"
              width="280"
            />
          </div>
          {loginErro && <p className="error-message">{loginErro}</p>}
        </div>
      </div>
    </div>
  );
}
