import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('app-theme');
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleSidebar = () => setSidebarOpen(o => !o);
  const toggleTheme   = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <>
      <Sidebar isOpen={sidebarOpen} />
      <div
        className="content-wrapper"
        style={{
          marginLeft: sidebarOpen ? 240 : 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <TopBar
          user={user}
          onLogout={onLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <main
          style={{
            paddingTop: 60,
            padding: 20,
            minHeight: '100vh',
            backgroundColor: theme === 'light' ? '#f9fafb' : '#1a202c',
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
