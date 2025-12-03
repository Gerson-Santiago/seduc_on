import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo-sistema.png'
import '../../styles/base.css'
import '../../styles/components.css'
import '../../styles/layout.css'
import '../../styles/variables.css'

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth();
  // Estado para alternância de tema escuro
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  // Efeito colateral: tema
  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode)
  }, [darkMode])

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>

      {/* TOPO DO SIDEBAR */}
      <div className="sidebar-header">

        {/* Logo: Adicionei style={{ cursor: 'pointer' }} para a mãozinha */}
        <img
          src={logo}
          alt="Bertioga"
          className="header-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => window.open('https://sites.google.com/seducbertioga.com.br/bertiogaedu/in%C3%ADcio', '_blank')}
        />

        {/* BOTÃO UNIFICADO: RESOLUÇÃO DO PROBLEMA */}
        <button
          className="sidebar-toggle"
          // Acessibilidade: O texto muda conforme o estado
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          type="button"
          onClick={onToggle}
        >
          <span className="material-symbols-rounded">
            {/* SE colapsado MOSTRA 'menu', SENÃO MOSTRA 'chevron_left' */}
            {collapsed ? 'menu' : 'chevron_left'}
          </span>
        </button>

      </div>

      {/* CONTEÚDO CENTRAL */}
      <div className="sidebar-content">
        <form className="search-form">
          <span className="material-symbols-rounded">search</span>
          <input type="search" placeholder="Buscar..." required />
        </form>

        <ul className="menu-list">
          <li className="menu-item">
            <NavLink to="/dashboard" end className="menu-link">
              <span className="material-symbols-rounded">dashboard</span>
              <span className="menu-label">Dashboard</span>
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/alunos" className="menu-link">
              <span className="material-symbols-rounded">dine_in</span>
              <span className="menu-label">Alunos</span>
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/busca-aluno" className="menu-link">
              <span className="material-symbols-rounded">person_search</span>
              <span className="menu-label">Buscar Aluno</span>
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/professores" className="menu-link">
              <span className="material-symbols-rounded">owl</span>
              <span className="menu-label">Professores</span>
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/escolas" className="menu-link">
              <span className="material-symbols-rounded">family_home</span>
              <span className="menu-label">Escolas</span>
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/turmas" className="menu-link">
              <span className="material-symbols-rounded">jamboard_kiosk</span>
              <span className="menu-label">Turmas</span>
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/usuarios" className="menu-link">
              <span className="material-symbols-rounded">group</span>
              <span className="menu-label">Usuários</span>
            </NavLink>
          </li>

          {/* Link visível apenas para Admins/Superadmins */}
          {user && (user.perfil === 'admin' || user.perfil === 'superadmin') && (
            <li className="menu-item">
              <NavLink to="/admin/solicitacoes" className="menu-link">
                <span className="material-symbols-rounded">person_add</span>
                <span className="menu-label">Solicitações</span>
              </NavLink>
            </li>
          )}

          <li className="menu-item">
            <NavLink to="/calendario" className="menu-link">
              <span className="material-symbols-rounded">calendar_today</span>
              <span className="menu-label">Calendário</span>
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/configuracoes" className="menu-link">
              <span className="material-symbols-rounded">settings</span>
              <span className="menu-label">Configurações</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* RODAPÉ */}
      <div className="sidebar-footer">
        <button
          className="theme-toggle"
          aria-label="Alternar tema"
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
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