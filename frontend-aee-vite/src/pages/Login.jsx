import React from 'react'
import logoPrefeitura from '../assets/logo-prefeitura.png'
import './Login.css'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { loginRedirect } = useAuth()

  return (
    <div className="login-page">
      <header className="login-header">
        <img src={logoPrefeitura} alt="Prefeitura de Bertioga" className="logo-prefeitura" />
      </header>

      <div className="login-container">
        <div className="login-card">
          <h1>Bem-vindo ao AEE</h1>
          <p>Faça login com sua conta <strong>@seducbertioga.com.br</strong></p>

          <button onClick={loginRedirect} className="google-login-button">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
            <span>Entrar com Google</span>
          </button>
        </div>
      </div>
    </div>
  )
}
