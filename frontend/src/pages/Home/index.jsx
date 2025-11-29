// frontend/src/pages/Home/index.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import do CSS (mesma pasta)
import './Home.css';

// Import da Logo (sobe 2 níveis: Home -> Pages -> Src -> Assets)
import logoPrefeitura from '../../assets/logo-prefeitura.png';

export default function Home() {
  const navigate = useNavigate();

  // Caminho do login vindo do .env ou padrão
  const loginPath = import.meta.env.VITE_LOGIN_PATH || '/login';

  return (
    <div className="home-container">

      {/* Cabeçalho */}
      <header className="home-header">
        <img
          src={logoPrefeitura}
          alt="Prefeitura de Bertioga"
          className="home-logo"
        />
        <nav>
          <button
            onClick={() => navigate(loginPath)}
            className="btn-nav"
          >
            Acessar Sistema
          </button>
        </nav>
      </header>

      {/* Conteúdo Principal (Card Centralizado) */}
      <main className="home-content">
        <div className="home-card">
          <h1>Atendimento Educacional Especializado</h1>
          <p>
            Sistema integrado para gestão da educação na rede municipal de Bertioga.
            Para acessar os recursos, utilize sua conta institucional.
          </p>

          <div className="home-actions">
            <button
              onClick={() => navigate(loginPath)}
              className="btn-primary"
            >
              Fazer Login <span className="material-symbols-rounded">login</span>
            </button>

            <Link to="/solicitar-acesso" className="btn-outline">
              Solicitar Acesso
            </Link>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="home-footer">
        <p>&copy; 2025 Seduc Bertioga - Departamento de Tecnologia Educacional</p>
      </footer>
    </div>
  );
}