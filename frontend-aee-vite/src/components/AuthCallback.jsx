// src/components/AuthCallback.jsx
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const idToken = hashParams.get('id_token')

    if (idToken) {
      login({ credential: idToken }).then(() => {
        // Corrigindo o replaceState para refletir o basename
        window.history.replaceState(null, '', import.meta.env.VITE_DASHBOARD_PATH)
        navigate(import.meta.env.VITE_DASHBOARD_PATH)

      })
    } else {
      navigate(import.meta.env.VITE_LOGIN_PATH)
    }
  }, [])

  return <p>Autenticando...</p>
}
