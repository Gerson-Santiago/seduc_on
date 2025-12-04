// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

// Importa a URL base da API do ambiente (variável de ambiente via import.meta.env)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
// Cria o contexto de autenticação

const AuthContext = createContext()
const LOCAL_STORAGE_KEY = 'seduc_on_user'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      validateSession(parsed.token)
    } else {
      setLoading(false)
    }
  }, [])

  const validateSession = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
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
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: credential }),
        })
      } catch (networkError) {
        throw new Error('Servidor fora do ar. Tente novamente mais tarde.')
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        if (response.status === 401) {
          throw new Error(body.error || 'Credenciais inválidas.');
        }
        if (response.status === 403) {
          setShowAccessDeniedModal(true);
          setLoading(false);
          return false;
        }
        throw new Error(body.message || 'Usuário não autorizado')
      }

      const data = await response.json()

      // ✅ Aqui chamamos validateSession para obter o user completo
      await validateSession(data.token)

      // Obs: validateSession já seta o user e o loading
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ token: data.token }))

      setError(null)
      return true // Indica sucesso

    } catch (e) {
      console.error('Login error:', e)
      setError(e.message)
      setUser(null)
      setLoading(false)
      return false // Indica falha
    }
  }

  //==========================================

  // para redicionamento dos link

  //==========================================
  const loginRedirect = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
      response_type: 'id_token',
      scope: 'openid email profile',
      prompt: 'select_account',
      hd: 'seducbertioga.com.br',
      nonce: crypto.randomUUID(),
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };


  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, loginRedirect, logout }}>
      {children}
      {showAccessDeniedModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '90%', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Acesso Negado</h2>
            <p style={{ marginBottom: '1.5rem' }}>Você não possui permissão. Solicite acesso pelo e-mail monitoramento@seducbertioga.com.br</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => { setShowAccessDeniedModal(false); window.location.href = '/solicitar-acesso'; }}
                style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Solicitar acesso
              </button>
              <button
                onClick={() => setShowAccessDeniedModal(false)}
                style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)