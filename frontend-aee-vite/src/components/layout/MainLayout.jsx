// frontend-aee-vite/src/components/layout/MainLayout.jsx
import React, { useState } from 'react'
import Sidebar from '../Sidebar'
import MainContent from '../layout/MainContent'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  function handleToggleSidebar() {
    setCollapsed(prev => !prev)
  }

  return (
    <>
      <Sidebar collapsed={collapsed} onToggle={handleToggleSidebar} />

      <div className="container">
        <MainContent />
      </div>
    </>
  )
}
