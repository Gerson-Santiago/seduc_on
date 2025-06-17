//aee/frontend-aee/src/components/Login.jsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ onLoginSuccess, onLoginError, loginErro }) {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Bem-vindo ao AEE</h1>
        <p>Faça login com sua conta @seducbertioga.com.br</p>
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
  );
}
