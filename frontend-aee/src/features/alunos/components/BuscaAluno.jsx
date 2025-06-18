//frontend-aee/src/features/alunos/components/BuscaAluno.jsx
import React, { useState } from 'react';

export default function BuscaAluno({ onAlunoLoaded }) {
  const [ra, setRa] = useState('');
  const [raErro, setRaErro] = useState(null);

  const buscarRa = async (e) => {
    e.preventDefault();
    setRaErro(null);
    onAlunoLoaded(null);

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
      onAlunoLoaded(data);
    } catch {
      setRaErro('Erro ao buscar aluno');
    }
  };

  return (
    <form onSubmit={buscarRa} className="search-form">
      <input
        type="text"
        placeholder="Digite o RA do aluno"
        value={ra}
        onChange={(e) => setRa(e.target.value)}
      />
      <button type="submit">Buscar</button>

      {raErro && <p className="error-message">{raErro}</p>}
    </form>
  );
}
