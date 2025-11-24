// aee/frontend-aee-vite/src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import '../styles/layout.css';

const MainLayout = () => {
  // Estado para controlar a Sidebar (colapsada ou não)
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [darkTheme, setDarkTheme] = useState(false);

  // Pegando dados do usuário logado
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="container">
      {/* Sidebar Lateral */}
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        darkTheme={darkTheme}
        onToggleTheme={setDarkTheme}
      />

      {/* Conteúdo Principal */}
      <div className={`main-wrapper ${collapsed ? 'collapsed' : ''}`}>

        {/* TopBar (Sem botão de menu, apenas usuário) */}
        <TopBar
          user={user}
          onLogout={logout}
        />

        {/* Área Dinâmica das Páginas */}
        <div className="content-area">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;