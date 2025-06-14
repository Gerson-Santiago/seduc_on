import React, { useState } from 'react';
import './App.css';

function App() {
  const [ra, setRa] = useState('');
  const [aluno, setAluno] = useState(null);
  const [erro, setErro] = useState(null);

  const buscarAluno = async (e) => {
    e.preventDefault();
    setErro(null);
    setAluno(null);
    try {
      const response = await fetch(`http://localhost:3000/api/alunos?ra=${ra}`);
      if (!response.ok) {
        throw new Error('Aluno não encontrado');
      }
      const data = await response.json();
      setAluno(data);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="App">
      <h1>Buscar Aluno por RA</h1>
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
