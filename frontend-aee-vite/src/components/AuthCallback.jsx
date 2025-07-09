import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ErrorModal from './ErrorModal'

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
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const idToken = hashParams.get('id_token')
    if (idToken) {
      login({ credential: idToken }).then(() => {
        window.history.replaceState(null, '', import.meta.env.VITE_DASHBOARD_PATH)
        navigate(import.meta.env.VITE_DASHBOARD_PATH)
      })
    } else {
      navigate(import.meta.env.VITE_LOGIN_PATH)
    }
  }, [])

  // 3. Se tiver mensagem de erro, exibe o modal
  if (errorMessage) {
    return <ErrorModal title="Erro de Login" message={errorMessage} />
  }

  return <p>Autenticando...</p>
}