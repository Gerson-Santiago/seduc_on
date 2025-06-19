// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()
const LOCAL_STORAGE_KEY = 'aee_user'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

useEffect(() => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (stored) {
    const parsed = JSON.parse(stored)
    console.log('TOKEN RECUPERADO DO localStorage:', parsed.token)
    validateSession(parsed.token)
  } else {
    console.log('NENHUM usuário no localStorage')
    setLoading(false)
  }
}, [])


  const validateSession = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Sessão inválida')
      const data = await response.json()
      setUser({ ...data.user, token })
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async ({ credential }) => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential }),
      })
      if (!response.ok) {
        const body = await response.json()
        throw new Error(body.message || 'Usuário não autorizado')
      }
      const data = await response.json()
      const userData = { ...data.user, token: data.token }
      setUser(userData)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData))
      console.log('SALVOU NO LOCALSTORAGE', userData)
      setError(null)
    } catch (e) {
      setError(e.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const loginRedirect = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/callback`,
      response_type: 'id_token',
      scope: 'openid email profile',
      prompt: 'select_account',
      nonce: crypto.randomUUID(),
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, loginRedirect, logout }}>
      {children}
    </AuthContext.Provider>
  )
}



export const useAuth = () => useContext(AuthContext)


