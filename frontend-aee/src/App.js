//frontend-aee/src/App.js
import React, { useState } from 'react';
import useAuth from './features/auth/hooks/useAuth';
import Login from './components/Login';
import TopBar from './components/layout/TopBar';
import AlunoPage from './pages/AlunoPage'
import Sidebar from './components/layout/Sidebar'; // Sidebar padrão
import TestSidebar from './novasidebar/TestSidebar';    // Sidebar para teste, renomeada

function App() {
  const { user, loginErro, onLoginSuccess, onLoginError, logout } = useAuth();
  const [aluno, setAluno] = useState(null);

  const [page, setPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const navigateTo = (targetPage) => {
    setAluno(null);
    setPage(targetPage);
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <>
      {/* Use a sidebar padrão */}
      <Sidebar isOpen={sidebarOpen} onNavigate={navigateTo} />
      <div style={{
        marginLeft: sidebarOpen ? 240 : 0,
        transition: 'margin-left 0.3s ease',
      }}>
        <TopBar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} user={user} onLogout={logout} />
        <main style={{ paddingTop: 60, padding: 20 }}>
          {page === 'alunos' && (
            <AlunoPage aluno={aluno} onAlunoLoaded={setAluno} />
          )}
          {page === 'home' && (
            <h2>Bem-vindo, {user.name}!</h2>
          )}
          {page === 'config' && (
            <h2>Página de Configurações (em breve)</h2>
          )}
          {page === 'testsidebar' && <TestSidebarPage />}
        </main>
      </div>
    </>
  );
}

function TestSidebarPage() {
  return (
    <TestSidebar />
  );
}

export default App;
