// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo-sistema.png'
// import '../style.css'
import '../../styles/base.css' // /aee/frontend-aee-vite/src/styles/base.css
import '../../styles/components.css' // /aee/frontend-aee-vite/src/styles/components.css
import '../../styles/layout.css' // /aee/frontend-aee-vite/src/styles/layout.css
import '../../styles/variables.css' // /aee/frontend-aee-vite/src/styles/variables.css

// Componente Sidebar recebe props: 
// - collapsed: booleano que define se está recolhido
// - onToggle: função para alternar entre expandido/recolhido
export default function Sidebar({ collapsed, onToggle }) {
  // Estado para alternância de tema escuro
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  // Efeito colateral: adiciona/remove classe no <body> quando darkMode muda
  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode)
  }, [darkMode])

  return (
    // Aplica classe 'collapsed' se o sidebar estiver recolhido
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>

      {/* TOPO DO SIDEBAR - LOGO + BOTÃO TOGGLE */}
      <div className="sidebar-header">

        {/* Logo do sistema, clicável para abrir o site da SEDUC Bertioga */}
        <img src={logo} alt="Bertioga" className="header-logo"
          onClick={() => window.open('https://sites.google.com/seducbertioga.com.br/bertiogaedu/in%C3%ADcio', '_blank')} />
        {/* Quando passar o mouse mudar de seta para mãozinha ao clicar no logo assim como os demais botões do site*/}

        {/* Botão de recolher/expandir sidebar */}
        <button
          className="sidebar-toggle"
          aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          type="button"
          onClick={onToggle}  // chama função passada via props
        >
          <span
            className="material-symbols-rounded"
            style={{
              transform: collapsed ? 'rotate(180deg)' : 'none', // seta apontando para o lado
              transition: 'transform 0.4s ease',                // animação suave
            }}
          >
            chevron_left
          </span>
        </button>
      </div>

      {/* CONTEÚDO CENTRAL DO SIDEBAR */}
      <div className="sidebar-content">
        {/* Campo de busca */}
        <form className="search-form">
          <span className="material-symbols-rounded">search</span>
          <input type="search" placeholder="Buscar..." required />
        </form>

        {/* Lista de menus */}
        <ul className="menu-list">
          {/* Cada item tem um ícone e um rótulo */}
          <li className="menu-item">
            <a href="#" className="menu-link active">
              <span className="material-symbols-rounded">dashboard</span>
              <span className="menu-label">Dashboard</span>
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link">
              <span className="material-symbols-rounded">insert_chart</span>
              <span className="menu-label">Recentes</span>
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link">
              <span className="material-symbols-rounded">star</span>
              <span className="menu-label">Favoritos</span>
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link">
              <span className="material-symbols-rounded">storefront</span>
              <span className="menu-label">Calendário</span>
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link">
              <span className="material-symbols-rounded">group</span>
              <span className="menu-label">Usuários</span>
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link">
              <span className="material-symbols-rounded">settings</span>
              <span className="menu-label">Configurações</span>
            </a>
          </li>
        </ul>
      </div>

      {/* RODAPÉ DO SIDEBAR - TOGGLE TEMA */}
      <div className="sidebar-footer">
        <button
          className="theme-toggle"
          aria-label="Alternar tema"
          type="button"
          onClick={() => setDarkMode((prev) => !prev)} // alterna entre claro/escuro
        >
          <div className="theme-label">
            <span className="theme-icon material-symbols-rounded">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="theme-text">{darkMode ? 'Claro' : 'Escuro'}</span>
          </div>
          <div className="theme-toggle-track">
            <div className="theme-toggle-indicator" />
          </div>
        </button>
      </div>
    </aside>
  )
}
