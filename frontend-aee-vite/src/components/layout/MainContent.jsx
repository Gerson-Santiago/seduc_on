// frontend-aee-vite/src/components/layout/MainContent.jsx
import React from 'react'
import '../../styles/base.css' // /home/sant/aee/frontend-aee-vite/src/styles/base.css
import '../../styles/components.css' // /home/sant/aee/frontend-aee-vite/src/styles/components.css
import '../../styles/layout.css' // /home/sant/aee/frontend-aee-vite/src/styles/layout.css
import '../../styles/variables.css' // /home/sant/aee/frontend-aee-vite/src/styles/variables.css

export default function MainContent() {
  return (
    // Componente principal do conteúdo, onde ficam as páginas cada botão do Sidebar vai abrir um MainContent diferente
    // onClick e vai abrir as configuraçẽos das opções 
    /**
     * Criar um botão para Pesquisar Alunos -> <MainSearchStudents />
     * Criar um botão para Alunos -> <MainAlunosIAEE />
     * Criar um botão para Escolas -> <MainEscolas />
     * 
     * Dashboard -> esta está em frontend-aee-vite/src/pages/Dashboard.jsx <Dashboard />
     * Recentes -> <MainRecent />
     * Favoritos -> <MainFavorites />
     * Calendário -> <MainCalendar />
     * Usuários -> <MainUsers />
     * Configurações -> <MainSettings />
    */

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