// aee/frontend-aee/src/App.js
import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loginErro, setLoginErro] = useState(null);
  const [ra, setRa] = useState('');
  const [aluno, setAluno] = useState(null);
  const [raErro, setRaErro] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
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

  const onLoginError = () => {
    setLoginErro('Falha no login com Google');
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user');
    setAluno(null);
    setRa('');
    setRaErro(null);
  };

  const buscarRa = async (e) => {
    e.preventDefault();
    setRaErro(null);
    setAluno(null);

    if (!ra) {
      setRaErro('Digite um RA válido');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/alunos/${ra}`);
      if (!response.ok) {
        setRaErro('Aluno não encontrado');
        return;
      }
      const data = await response.json();
      setAluno(data);
    } catch (error) {
      setRaErro('Erro ao buscar aluno');
    }
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Bem-vindo ao AEE</h1>
          <p>Faça login com sua conta @seducbertioga.com.br</p>
          <div className="google-button">
            <GoogleLogin
              onSuccess={onLoginSuccess}
              onError={onLoginError}
              useOneTap
              shape="rectangular"
              theme="filled_blue"
              size="large"
              width="280"
            />
          </div>
          {loginErro && <p className="error-message">{loginErro}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Olá, {user.name}</h1>
      <p>Você está logado com {user.email}</p>
      <button className="logout-btn" onClick={logout}>Sair</button>

      <form onSubmit={buscarRa} className="search-form">
        <input
          type="text"
          placeholder="Digite o RA do aluno"
          value={ra}
          onChange={(e) => setRa(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {raErro && <p className="error-message">{raErro}</p>}

      {aluno && (
        <div className="aluno-card">
          <h2>{aluno.nome_aluno}</h2>
          <p><strong>RA:</strong> {aluno.ra}</p>
          <p><strong>Data de nascimento:</strong> {new Date(aluno.data_nasci).toLocaleDateString()}</p>
          <p><strong>Situação:</strong> {aluno.situacao}</p>
          <p><strong>Escola:</strong> {aluno.nome_escola}</p>
          <p><strong>Turma + Período:</strong> {aluno.turma} - {aluno.periodo}</p>
          <p><strong>Endereço:</strong> {aluno.endereco}</p>
          <p><strong>Gênero:</strong> {aluno.genero}</p>
          <p><strong>Bolsa Família:</strong> {aluno.bolsa_familia}</p>
          <p><strong>Etnia:</strong> {aluno.etnia}</p>
        </div>
      )}
    </div>
  );
}

export default App;
