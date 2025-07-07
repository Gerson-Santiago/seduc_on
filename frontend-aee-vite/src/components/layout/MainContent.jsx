// frontend-aee-vite/src/components/layout/MainContent.jsx
import React from 'react'
import '../style.css'

export default function MainContent() {
  return (
    <main className="main-content">
      <h1 className="page-title">Painel Geral</h1>
      <p className="card">
        Bem-vindo ao seu painel! Use o menu para navegar, alternar a visualização
        da barra lateral ou trocar entre temas claro e escuro.
      </p>
      {/* resto do conteúdo */}
    </main>
  )
}