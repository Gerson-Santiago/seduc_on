import React, { useState, useRef, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';

export default function SettingsDropdown({ theme, onToggleTheme }) {
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

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        aria-label="Configurações"
      >
        <FiSettings size={20} />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 30,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: 140,
            zIndex: 1001,
            padding: '8px',
          }}
        >
          <button
            onClick={() => { onToggleTheme(); setOpen(false); }}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              padding: '6px 8px',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Tema: {theme === 'light' ? 'Claro' : 'Escuro'}
          </button>
        </div>
      )}
    </div>
  );
}
