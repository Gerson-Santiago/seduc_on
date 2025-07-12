// src/components/UserDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import './UserDropdown.css';

export default function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const displayName = user.nome || user.name || 'Usuário';
  const [firstName, lastName] = displayName.split(' ');

  return (
    <div ref={ref} className="user-dropdown-container">
      <img
        src={user.picture}
        alt={displayName}
        className="user-dropdown-avatar"
        onClick={() => setOpen(o => !o)}
      />
      {open && (
        <div className="user-dropdown-menu">
          <div className="user-dropdown-info">
            <div className="user-name">{firstName} {lastName ?? ''}</div>
            <div className="user-email">{user.email}</div>
            <hr className="user-separator" />
            <div className="user-perfil">{user.perfil}</div>
            {user.role && (
              <div className="user-role">Nível: {user.role}</div>
            )}
          </div>
          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="dropdown-logout"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
