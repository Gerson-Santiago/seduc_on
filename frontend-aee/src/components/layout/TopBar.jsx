import React from 'react';
import { FiMenu } from 'react-icons/fi';
import SettingsDropdown from './SettingsDropdown';
import UserDropdown     from './UserDropdown';

export default function TopBar({
  user,
  onLogout,
  theme,
  onToggleTheme,
  onToggleSidebar,
  sidebarOpen,
}) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 240 : 0,
        right: 0,
        height: 60,
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        transition: 'left 0.3s ease',
        zIndex: 90,
      }}
    >
      <button
        onClick={onToggleSidebar}
        style={{
          background: 'none',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
        }}
        aria-label="Toggle sidebar"
      >
        <FiMenu />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <SettingsDropdown
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <UserDropdown
          user={user}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
