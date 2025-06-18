// src/components/layout/Sidebar.jsx
import React from 'react';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';

export default function Sidebar({ isOpen, onNavigate }) {
  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : -240,
        width: 240,
        height: '100vh',
        backgroundColor: '#fff',
        boxShadow: '2px 0 6px rgba(0,0,0,0.1)',
        transition: 'left 0.3s ease',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <nav style={{ padding: 20 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={itemStyle} onClick={() => onNavigate('home')}>
            <FiHome style={{ marginRight: 8 }} /> Home
          </li>
          <li style={itemStyle} onClick={() => onNavigate('alunos')}>
            <FiUser style={{ marginRight: 8 }} /> Buscar Aluno
          </li>
          <li style={itemStyle} onClick={() => onNavigate('config')}>
            <FiSettings style={{ marginRight: 8 }} /> Configurações
          </li>
          <li style={itemStyle} onClick={() => onNavigate('testsidebar')}>
            <FiSettings style={{ marginRight: 8 }} /> testsidebar
          </li>


        </ul>
      </nav>
    </aside>
  );
}

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0',
  cursor: 'pointer',
  fontSize: 16,
  color: '#333',
};
