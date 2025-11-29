// frontend/src/components/layout/MainContent.jsx
import React from 'react';
import '../../styles/base.css';
import '../../styles/components.css';
import '../../styles/layout.css';
import '../../styles/variables.css';

export default function MainContent() {
  return (
    <main className="main-content">
      <h1 className="page-title">Painel Geral</h1>

      <div className="card">
        <p>
          Bem-vindo ao seu painel! Use o menu para navegar ou os atalhos abaixo.
        </p>
      </div>

      {/* AQUI: Futuramente vamos criar o componente <GridMenu /> 
          para os botões que você listou (Alunos, Escolas, etc.)
      */}
      <div style={{ marginTop: '20px', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {/* Placeholder para visualizar onde ficarão os botões */}
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>📚 Alunos</div>
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>🏫 Escolas</div>
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>📅 Calendário</div>
      </div>
    </main>
  );
}