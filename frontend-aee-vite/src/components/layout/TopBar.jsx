// src/components/TopBar.jsx
import React from 'react'
import UserDropdown from '../topbar/UserDropdown';

export default function TopBar({ onSidebarToggle, user, onLogout }) {
  return (
    <header className="topbar">
      {/* Botão unificado de menu (hambúrguer) */}
      <button
        className="sidebar-toggle"
        aria-label="Alternar sidebar"
        type="button"
        onClick={onSidebarToggle}
      >
        <span className="material-symbols-rounded">menu</span>
      </button>

      {/* Área direita com foto e dropdown */}
      <div className="topbar-right">
        {user && <UserDropdown user={user} onLogout={onLogout} />}
      </div>
    </header>
  )
}
