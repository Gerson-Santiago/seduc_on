// frontend-aee-vite/src/components/layout/MainContent.jsx
import React from 'react'
import '../../styles/base.css' // /home/sant/aee/frontend-aee-vite/src/styles/base.css
import '../../styles/components.css' // /home/sant/aee/frontend-aee-vite/src/styles/components.css
import '../../styles/layout.css' // /home/sant/aee/frontend-aee-vite/src/styles/layout.css
import '../../styles/variables.css' // /home/sant/aee/frontend-aee-vite/src/styles/variables.css

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