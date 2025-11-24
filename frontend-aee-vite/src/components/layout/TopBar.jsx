// src/components/layout/TopBar.jsx
import React from 'react';
import UserDropdown from '../topbar/UserDropdown';

export default function TopBar({ user, onLogout }) {
  // Debug: Vamos ver no console se o usuário está chegando
  console.log("TopBar user:", user);

  return (
    <header className="topbar">
      {/* Lado Esquerdo: Vazio ou Título (sem botão hambúrguer) */}
      <div className="topbar-left">
        {/* Se quiser um título aqui, descomente a linha abaixo */}
        {/* <h3 style={{ margin: 0 }}>Seduc Bertioga</h3> */}
      </div>

      {/* Lado Direito: Apenas o Dropdown do Usuário */}
      <div className="topbar-right">
        {user ? (
          <UserDropdown user={user} onLogout={onLogout} />
        ) : (
          <div className="user-loading">Carregando...</div>
        )}
      </div>
    </header>
  );
}