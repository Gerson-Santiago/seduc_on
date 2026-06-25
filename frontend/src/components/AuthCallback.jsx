// frontend/src/components/AuthCallback.jsx

import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // 1. Checar query string por erro do Google
    const params = new URLSearchParams(location.search)
    const authError = params.get('authError')
    if (authError) {
      if (authError === 'org_internal_only') {
        setErrorMessage(
          'Por favor, utilize seu e‑mail institucional da SEDUC Bertioga (ex: nome@seducbertioga.com.br).'
        )
      } else {
        setErrorMessage('Ocorreu um erro de autenticação. Tente novamente.')
      }
      return
    }

    // 2. Fluxo normal de hash token
    const hash = window.location.hash.substring(1)
    console.log('[AuthCallback] hash bruto:', hash ? hash.substring(0, 60) + '...' : '(vazio)')

    const hashParams = new URLSearchParams(hash)
    const idToken = hashParams.get('id_token')

    console.log('[AuthCallback] id_token encontrado:', !!idToken)

    if (!idToken) {
      console.warn('[AuthCallback] Nenhum id_token no hash. Redirecionando para login.')
      navigate(import.meta.env.VITE_LOGIN_PATH)
      return
    }

    login({ credential: idToken })
      .then((success) => {
        console.log('[AuthCallback] login() resultado:', success)
        if (success) {
          navigate(import.meta.env.VITE_DASHBOARD_PATH)
        } else {
          navigate(import.meta.env.VITE_LOGIN_PATH)
        }
      })
      .catch((err) => {
        console.error('[AuthCallback] Erro no login:', err)
        setErrorMessage('Erro ao autenticar. Tente novamente.')
      })
  }, [])

  // 3. Exibe mensagem de erro
  if (errorMessage) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Erro de Autenticação</h2>
        <p>{errorMessage}</p>
        <button onClick={() => navigate(import.meta.env.VITE_LOGIN_PATH)}
          style={{ marginTop: '1rem', padding: '10px 20px', cursor: 'pointer' }}>
          Voltar ao Login
        </button>
      </div>
    )
  }

  return <p>Autenticando...</p>
}