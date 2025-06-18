//aee/frontend-aee/src/features/alunos/components/AlunoCard.jsx
import React from 'react';

export default function AlunoCard({ aluno }) {
  return (
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
  );
}
