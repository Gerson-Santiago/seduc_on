import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [ra, setRa] = useState('');
  const [aluno, setAluno] = useState(null);
  const [erro, setErro] = useState(null);
  const [loginErro, setLoginErro] = useState(null);

  // Tentar recuperar usuário salvo no localStorage ao montar o componente
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

      // Salvar usuário no localStorage para persistir o login
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
    // Remover usuário do localStorage ao sair
    localStorage.removeItem('user');
  };

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

  if (!user) {
    return (
      <div className="App">
        <h1>Login</h1>
        <GoogleLogin
          onSuccess={onLoginSuccess}
          onError={onLoginError}
        />
        {loginErro && <p style={{ color: 'red' }}>{loginErro}</p>}
      </div>
    );
  }

  return (
    <div className="App">
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

export default App;
