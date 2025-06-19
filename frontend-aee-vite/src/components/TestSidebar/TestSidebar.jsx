import React, { useState, useEffect } from 'react';
import './style.css'; // funciona assim
import logo from './logo.png';

export default function TestSidebar() {
  // Estados para sidebar colapsada e tema
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  // Carregar preferências e detectar tamanho da tela
  useEffect(() => {
    // Tema salvo no localStorage ou preferencia do sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDarkTheme = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setDarkTheme(shouldUseDarkTheme);

    // Sidebar aberta por padrão em telas grandes (>768px)
    setSidebarCollapsed(window.innerWidth <= 768);
  }, []);

  // Atualizar class do body quando tema mudar
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkTheme]);

  // Atualizar class do body para controle de overflow no mobile (quando sidebar aberta)
  useEffect(() => {
    if (!sidebarCollapsed && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sidebarCollapsed]);

  // Função para alternar tema
  function toggleTheme() {
    const newTheme = !darkTheme;
    setDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  }

  // Função para alternar sidebar
  function toggleSidebar() {
    setSidebarCollapsed(!sidebarCollapsed);
  }

  // Foco no input da busca ao clicar no formulário, e expandir sidebar se colapsada
  function onSearchClick(e) {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
      // foco no input após renderizar sidebar aberta
      setTimeout(() => {
        const input = e.currentTarget.querySelector('input');
        if (input) input.focus();
      }, 100);
    }
  }

  // Atualiza o ícone do tema no botão conforme estado do tema e sidebar
  function getThemeIcon() {
    if (sidebarCollapsed) {
      return darkTheme ? 'light_mode' : 'dark_mode';
    }
    return 'dark_mode';
  }

  return (
    <div className={`container`}>
      {/* Navbar com botão para abrir sidebar no mobile */}
      <nav className="site-nav">
        <button
          className="sidebar-toggle"
          aria-label="Alternar menu lateral"
          onClick={toggleSidebar}
          type="button"
        >
          <span className="material-symbols-rounded">menu</span>
        </button>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Bertioga" className="header-logo" />
          <button
            className="sidebar-toggle"
            aria-label="Recolher sidebar"
            onClick={toggleSidebar}
            type="button"
          >
            <span className="material-symbols-rounded">chevron_left</span>
          </button>
        </div>

        <div className="sidebar-content">
          <form className="search-form" onClick={onSearchClick}>
            <span className="material-symbols-rounded">search</span>
            <input type="search" placeholder="Buscar..." required />
          </form>

          <ul className="menu-list">
            <li className="menu-item">
              <a href="#" className="menu-link active">
                <span className="material-symbols-rounded">dashboard</span>
                <span className="menu-label">Dashboard</span>
              </a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-link">
                <span className="material-symbols-rounded">insert_chart</span>
                <span className="menu-label">Analytics</span>
              </a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-link">
                <span className="material-symbols-rounded">notifications</span>
                <span className="menu-label">Notificações</span>
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
                <span className="menu-label">Produtos</span>
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

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            aria-label="Alternar tema escuro/claro"
            onClick={toggleTheme}
            type="button"
          >
            <div className="theme-label">
              <span className="theme-icon material-symbols-rounded">{getThemeIcon()}</span>
              <span className="theme-text">Modo Escuro</span>
            </div>
            <div className="theme-toggle-track">
              <div className="theme-toggle-indicator" />
            </div>
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <h1 className="page-title">Painel Geral</h1>
        <p className="card">
          Bem-vindo ao seu painel! Use o menu para navegar, alternar a
          visualização da barra lateral ou trocar entre temas claro e escuro.
        </p>
      </main>
    </div>
  );
}
