// frontend-aee-vite/src/components/topbar/UserDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';

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

  // console.log('user picture:', user?.picture);


  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* imagem google não está aparecendo */}
      <img
        src={user.picture}
        alt={user.name}
        style={{ width: 36, height: 36, borderRadius: '50%', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}
      />
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 44,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: 180,
            zIndex: 1001,
            padding: '10px',
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{user.email}</div>
            {user.role && <div style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.6 }}>Nível: {user.role}</div>}
          </div>
          <button
            onClick={() => { onLogout(); setOpen(false); }}
            style={{
              width: '100%',
              padding: '6px 0',
              backgroundColor: '#e53e3e',
              border: 'none',
              borderRadius: 4,
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
