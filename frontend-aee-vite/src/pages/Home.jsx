// frontend-aee-vite/src/pages/Home.jsx
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [gitStatus, setGitStatus] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  return (
    <>
      <div className="home-container">
        <div className="home-card">
          <h1>Bem-vindo ao Sistema</h1>
          <p>
            Para acessar os recursos do sistema, utilize sua conta institucional.
            Clique abaixo para fazer login.
          </p>
         <button onClick={() => navigate(import.meta.env.VITE_LOGIN_PATH)}>

            Ir para o Login <span className="material-symbols-rounded">login</span>
          </button>
        </div>
      </div>

    </>
  )
}
