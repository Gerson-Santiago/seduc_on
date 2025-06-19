import React, { useEffect, useRef } from 'react'
import logoPrefeitura from '../assets/logo-prefeitura.png'
import './Login.css'

export default function Login() {
  const divRef = useRef(null)

  useEffect(() => {
    /* global google */
    if (window.google && divRef.current) {
      window.google.accounts.id.initialize({
        client_id: 'SEU_CLIENT_ID_AQUI', // Substitua pelo seu client_id real
        callback: (response) => {
          console.log('Token JWT:', response.credential)
          // Aqui você pode enviar o token para o backend ou AuthContext
        }
      })

      window.google.accounts.id.renderButton(divRef.current, {
        theme: 'filled_black', //theme: 'outline', // ou 
        size: 'large',
        type: 'standard',
        shape: 'pill',
        logo_alignment: 'left',
        width:280
      })

      window.google.accounts.id.prompt()
    }
  }, [])

  return (
    <div className="login-page">
      <header className="login-header">
        <img src={logoPrefeitura} alt="Prefeitura de Bertioga" className="logo-prefeitura" />
      </header>

      <div className="login-container">
        <div className="login-card">
          <h1>Bem-vindo ao AEE</h1>
          <p>Faça login com sua conta <strong>@seducbertioga.com.br</strong></p>
          <div ref={divRef}></div>
        </div>
      </div>
    </div>
  )
}
