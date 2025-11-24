// aee/frontend-aee-vite/src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'; // <--- Importamos Navigate
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import '../styles/layout.css';

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [darkTheme, setDarkTheme] = useState(false);

  // Pegamos também o "loading" do contexto
  const { user, logout, loading } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // 1. Se estiver carregando a sessão, mostramos algo simples para não piscar a tela de login
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f3f4f6'
      }}>
        Carregando sistema...
      </div>
    );
  }

  // 2. PROTEÇÃO: Se não tem usuário e não está carregando, manda pra Home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. Se chegou aqui, está logado. Renderiza o Layout.
  return (
    <div className="container">
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        darkTheme={darkTheme}
        onToggleTheme={setDarkTheme}
      />

      <div className={`main-wrapper ${collapsed ? 'collapsed' : ''}`}>

        <TopBar
          user={user}
          onLogout={logout}
        />

        <div className="content-area">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;