import React, { useState, useCallback, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

/**
 * Componente de layout principal que encapsula a estrutura da aplicação
 * com Sidebar, TopBar e área de conteúdo principal.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children O conteúdo da página a ser renderizado.
 */
export default function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
      />

      <div className={`container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar
          user={user}
          onLogout={logout}
        />

        {/* O Outlet renderiza o componente da rota filha correspondente */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}