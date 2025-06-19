// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react'
import logo from '../components/TestSidebar/logo.png'
import './style.css'

export default function Sidebar({ collapsed, onToggle }) {
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode)
  }, [darkMode])

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Topo do sidebar  */}
      {/* melhorar a interatividade  */}
      <div className="sidebar-header">
        <img src={logo} alt="Bertioga" className="header-logo" />   
        {/* Botão Abrir fecher sidebar */}
        {/* Só está fechando precisa fazer abrir tbm*/}
        <button
          className="sidebar-toggle"
          aria-label="Recolher sidebar"
          type="button"
          onClick={onToggle}
        >
          <span className="material-symbols-rounded">chevron_left</span>
        </button>  
      </div>

      
      <div className="sidebar-content">
        <form className="search-form">
          <span className="material-symbols-rounded">search</span>
          <input type="search" placeholder="Buscar..." required />
        </form>
        
        <ul className="menu-list">
          
          {/*Botões principais da site*/}
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


          {/* Repensar onde será manter aqui até decidir --> não é prioridade*/}
          {/* <li className="menu-item">
            <a href="#" className="menu-link">
              <span className="material-symbols-rounded">notifications</span>
              <span className="menu-label">Notificações</span>
            </a>
          </li> */}
          <li className="menu-item">
            <a href="#" className="menu-link">
              <span className="material-symbols-rounded">star</span>
              <span className="menu-label">Favoritos</span>
            </a>
          </li>
          <li className="menu-item">
            {/* Precisa melhorar o icone para um Calendário  */}
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

      {/* Botão darkMode */}
      <div className="sidebar-footer">
        <button
          className="theme-toggle"
          aria-label="Alternar tema"
          type="button"
          onClick={() => setDarkMode(prev => !prev)}
        >
          <div className="theme-label">
            <span className="theme-icon material-symbols-rounded">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="theme-text">
              {darkMode ? 'Claro' : 'Escuro'}
            </span>
          </div>
          <div className="theme-toggle-track">
            <div className="theme-toggle-indicator" />
          </div>
        </button>
      </div>
    </aside>
  )
}