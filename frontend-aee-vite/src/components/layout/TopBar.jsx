// src/components/TopBar.jsx
import React from 'react'
import UserDropdown from '../topbar/UserDropdown';

export default function TopBar({ onSidebarToggle, user, onLogout }) {
  return (
    <header className="topbar">

      {/* 
      A interatividade de abrir e fecher deste botão precisa ser
      implementada em 





        sidebar --> 
      */}

      
      <button className="sidebar-toggle" onClick={onSidebarToggle} type="button">
        <span className="material-symbols-rounded">menu</span>
      </button>




      {/* Precisa pegar a foto do google do usuario logado  */}
       <div className="topbar-right">
        {user && <UserDropdown user={user} onLogout={onLogout} />}
      </div>
      
    </header>
  )
}
