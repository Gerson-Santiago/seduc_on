// src/components/TopBar.jsx
import React from 'react'
import UserDropdown from '../topbar/UserDropdown';

export default function TopBar({ onSidebarToggle, user, onLogout }) {
  return (
    <header className="topbar">
      {/* Área direita com foto e dropdown foto Google*/}
      <div className="topbar-right">
        {user && <UserDropdown user={user} onLogout={onLogout} />}
      </div>
    </header>
  )
}
