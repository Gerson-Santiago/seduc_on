import React from 'react'
import logoPrefeitura from '../assets/logo-prefeitura.png'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login({ loginErro }) {
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
          <button className="google-button" onClick={loginRedirect}>
            Entrar com Google
          </button>
          {loginErro && <p className="error-message">{loginErro}</p>}
        </div>
      </div>
    </div>
  )
}
