// frontend-aee-vite/src/pages/Dashboard.jsx
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import MainContent from '../components/layout/MainContent'

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768)
  const [darkTheme, setDarkTheme] = React.useState(false) // ou importe useState e use aqui também
  const { user, logout } = useAuth()

  return (
    <div className="container">



      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(prev => !prev)}
        darkTheme={darkTheme}
        onToggleTheme={setDarkTheme}
      />

      <div className={`main-wrapper ${collapsed ? 'collapsed' : ''}`}>
        <TopBar
          onSidebarToggle={() => setCollapsed(!collapsed)}
          user={user}
          onLogout={logout}
        />
        <MainContent />
      </div>
    </div>
  )
}
