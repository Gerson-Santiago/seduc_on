import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import '../../styles/layout.css';

/**
 * Componente de layout principal que encapsula a estrutura da aplicação
 * com Sidebar, TopBar e área de conteúdo principal.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children O conteúdo da página a ser renderizado.
 * @param {object} props.user O objeto do usuário logado.
 * @param {function} props.onLogout A função para executar o logout.
 */
export default function MainLayout({ children, user, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
          onLogout={onLogout} 
        />
        
        {/* O Outlet renderiza o componente da rota filha correspondente */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}