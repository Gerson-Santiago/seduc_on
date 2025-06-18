import React from 'react'
import BuscaAluno from '../features/alunos/components/BuscaAluno'
import AlunoCard from '../features/alunos/components/AlunoCard'

export default function AlunoPage({ aluno, onAlunoLoaded }) {
  return (
    <div className="aluno-page">
      <h2>Buscar Aluno</h2>
      <BuscaAluno onAlunoLoaded={onAlunoLoaded} />
      {aluno && <AlunoCard aluno={aluno} />}
    </div>
  );
}
