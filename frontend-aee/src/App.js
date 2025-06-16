// aee/frontend-aee/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './App.css';

// Tela de Login
function Login({ onLoginSuccess, loginErro }) {
  return (
    <div>
      <h1>Login</h1>
      <GoogleLogin
        onSuccess={onLoginSuccess}
        onError={() => console.log('Login falhou')}
      />
      {loginErro && <p style={{ color: 'red' }}>{loginErro}</p>}
    </div>
  );
}

// Tela Home - busca aluno e logout
function Home({ user, logout }) {
  const [ra, setRa] = useState('');
  const [aluno, setAluno] = useState(null);
  const [erro, setErro] = useState(null);

  const buscarAluno = async (e) => {
    e.preventDefault();
    setErro(null);
    setAluno(null);
    try {
      const response = await fetch(`http://localhost:3000/api/alunos?ra=${ra}`);
      if (!response.ok) throw new Error('Aluno não encontrado');
      const data = await response.json();
      setAluno(data);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div>
      <h1>Buscar Aluno por RA</h1>
      <p>Usuário logado: {user.name} ({user.email})</p>
      <button onClick={logout}>Sair / Trocar Conta</button>

      <form onSubmit={buscarAluno}>
        <input
          type="text"
          placeholder="Digite o RA"
          value={ra}
          onChange={(e) => setRa(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {aluno && (
        <div>
          <h2>Dados do Aluno</h2>
          <p><strong>Nome:</strong> {aluno.nome_aluno}</p>
          <p><strong>RA:</strong> {aluno.ra}</p>
          <p><strong>Data de Nascimento:</strong> {new Date(aluno.data_nasci).toLocaleDateString()}</p>
          <p><strong>Escola:</strong> {aluno.nome_escola}</p>
          <p><strong>Turma:</strong> {aluno.turma}</p>
          <p><strong>Situação:</strong> {aluno.situacao}</p>
        </div>
      )}
    </div>
  );
}

// Componente principal App com rotas
function App() {
  const [user, setUser] = useState(null);
  const [loginErro, setLoginErro] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const onLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      if (!email.endsWith('@seducbertioga.com.br')) {
        setLoginErro('Domínio não permitido');
        return;
      }

      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setLoginErro('Usuário não autorizado');
        return;
      }

      const data = await response.json();
      const userData = { ...decoded, role: data.usuario.role };
      
      setUser(userData);
      setLoginErro(null);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
      setLoginErro('Erro ao processar login');
    }
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        {/* Se usuário já está logado, redireciona login para home */}
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login onLoginSuccess={onLoginSuccess} loginErro={loginErro} />} />
        
        {/* Rota protegida /home */}
        <Route path="/home" element={user ? <Home user={user} logout={logout} /> : <Navigate to="/login" />} />
        
        {/* /aee redireciona para login */}
        <Route path="/aee" element={<Navigate to="/login" />} />
        
        {/* Rota padrão (qualquer outra) redireciona para /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
