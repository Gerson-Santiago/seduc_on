// frontend-aee/src/novasidebar/Sidebar.jsx
import React, { useState, useEffect, useRef } from "react";
import "./style.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [darkTheme, setDarkTheme] = useState(false);

  const sidebarRef = useRef(null);
  const themeIconRef = useRef(null);
  const searchInputRef = useRef(null);

  // Função para atualizar ícone de tema (mesmo comportamento do JS original)
  const updateThemeIcon = () => {
    if (!themeIconRef.current) return;
    themeIconRef.current.textContent = collapsed
      ? darkTheme
        ? "light_mode"
        : "dark_mode"
      : "dark_mode";
  };

  // Carrega tema do localStorage / sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    setDarkTheme(shouldUseDark);
    updateThemeIcon();
  }, []);

  // Aplica ou remove classe dark-theme no body e atualiza ícone quando tema muda
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    updateThemeIcon();
    localStorage.setItem("theme", darkTheme ? "dark" : "light");
  }, [darkTheme]);

  // Atualiza classe collapsed na sidebar
  useEffect(() => {
    if (!sidebarRef.current) return;
    if (collapsed) {
      sidebarRef.current.classList.add("collapsed");
    } else {
      sidebarRef.current.classList.remove("collapsed");
    }
    updateThemeIcon();
  }, [collapsed]);

  // Escuta resize para ajustar sidebar default (como no código original)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && collapsed) {
        setCollapsed(false);
      }
      if (window.innerWidth <= 768 && !collapsed) {
        setCollapsed(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  // Eventos dos botões toggle sidebar
  const handleSidebarToggle = () => {
    setCollapsed((c) => !c);
  };

  // Evento toggle tema
  const handleThemeToggle = () => {
    setDarkTheme((d) => !d);
  };

  // Evento clique no form busca para expandir sidebar se estiver recolhido
  const handleSearchClick = () => {
    if (collapsed) {
      setCollapsed(false);
      // Dá foco no input após expandir
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 100);
    }
  };

  return (
    <>
      <nav className="site-nav">
        <button
          className="sidebar-toggle"
          aria-label="Alternar menu lateral"
          onClick={handleSidebarToggle}
          type="button"
        >
          <span className="material-symbols-rounded">menu</span>
        </button>
      </nav>

      <div className="container">
        <aside className="sidebar collapsed" ref={sidebarRef}>
          <div className="sidebar-header">
            <img src="logo.png" alt="Bertioga" className="header-logo" />
            <button
              className="sidebar-toggle"
              aria-label="Recolher sidebar"
              onClick={handleSidebarToggle}
              type="button"
            >
              <span className="material-symbols-rounded">chevron_left</span>
            </button>
          </div>

          <div className="sidebar-content">
            <form action="#" className="search-form" onClick={handleSearchClick}>
              <span className="material-symbols-rounded">search</span>
              <input
                type="search"
                placeholder="Buscar..."
                required
                ref={searchInputRef}
              />
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
              onClick={handleThemeToggle}
              type="button"
            >
              <div className="theme-label">
                <span
                  className="theme-icon material-symbols-rounded"
                  ref={themeIconRef}
                >
                  dark_mode
                </span>
                <span className="theme-text">Modo Escuro</span>
              </div>
              <div className="theme-toggle-track">
                <div className="theme-toggle-indicator"></div>
              </div>
            </button>
          </div>
        </aside>

        <main className="main-content">
          <h1 className="page-title">Painel Geral</h1>
          <p className="card">
            Bem-vindo ao seu painel! 
            Use o menu para navegar, alternar a visualização da barra lateral 
            Está disponivel trocar entre temas claro e escuro.
            Em desenvolvimento...
          </p>
        </main>
      </div>
    </>
  );
}
