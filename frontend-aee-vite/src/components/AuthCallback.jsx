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

    // console.log('ID Token do Google:', idToken); 

    if (idToken) {
      login({ credential: idToken }).then(() => {
        window.history.replaceState(null, '', '/dashboard2')
        navigate('/dashboard2')
      })
    } else {
      navigate('/login')
    }
  }, [])

  return <p>Autenticando...</p>
}
