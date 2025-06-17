// src/App.js
import React, { useState, useEffect } from 'react';
import useAuth from './features/auth/hooks/useAuth';
import Login from './components/Login';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import BuscaAluno from './features/alunos/components/BuscaAluno';
import AlunoCard from './features/alunos/components/AlunoCard';

function App() {
  const { user, loginErro, onLoginSuccess, onLoginError, logout } = useAuth();
  const [aluno, setAluno] = useState(null);

  // Nova linha: controle de página
  const [page, setPage] = useState('alunos'); // padrão: 'alunos'

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(o => !o);

  if (!user) {
    return (
      <Login
        onLoginSuccess={onLoginSuccess}
        onLoginError={onLoginError}
        loginErro={loginErro}
      />
    );
  }

  // Função que o Sidebar vai chamar para navegar
  const navigateTo = (targetPage) => {
    setAluno(null);   // limpa aluno ao mudar de página
    setPage(targetPage);
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onNavigate={navigateTo} />
      <div style={{
        marginLeft: sidebarOpen ? 240 : 0,
        transition: 'margin-left 0.3s ease',
      }}>
        <TopBar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} user={user} onLogout={logout} />
        <main style={{ paddingTop: 60, padding: 20 }}>
          {page === 'alunos' && (
            <>
              <BuscaAluno onAlunoLoaded={setAluno} />
              {aluno && <AlunoCard aluno={aluno} />}
            </>
          )}
          {page === 'home' && (
            <h2>Bem-vindo, {user.name}!</h2>
          )}
          {page === 'config' && (
            <h2>Página de Configurações (em breve)</h2>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
