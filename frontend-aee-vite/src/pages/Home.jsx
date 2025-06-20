import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [gitStatus, setGitStatus] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    async function fetchGitStatus() {
      try {
        const res = await fetch('/api/git-status')
        const data = await res.json()

        setGitStatus(data)
        setShowPopup(true)

        // Esconde o pop-up após 7 segundos
        setTimeout(() => setShowPopup(false), 7000)
      } catch (error) {
        console.error('Erro ao buscar status Git:', error)
      }
    }
    fetchGitStatus()
  }, [])

  return (
    <>
      <div className="home-container">
        <div className="home-card">
          <h1>Bem-vindo ao Sistema</h1>
          <p>
            Para acessar os recursos do sistema, utilize sua conta institucional.
            Clique abaixo para fazer login.
          </p>
          <button onClick={() => navigate('/login')}>
            Ir para o Login <span className="material-symbols-rounded">login</span>
          </button>
        </div>
      </div>

      {showPopup && gitStatus && (
        <div className="git-status-popup">
          <p>Branch local: {gitStatus.branch}.</p>
          {gitStatus.ahead === 0 && gitStatus.behind === 0 ? (
            <p>✅ Branch está sincronizada com remoto.</p>
          ) : (
            <>
              {gitStatus.ahead > 0 && <p>⚠️ Branch está à frente do remoto por {gitStatus.ahead} commit(s).</p>}
              {gitStatus.behind > 0 && <p>⚠️ Branch está atrás do remoto por {gitStatus.behind} commit(s).</p>}
            </>
          )}
        </div>
      )}
    </>
  )
}
