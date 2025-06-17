import React from 'react'
import Sidebar from '../layout/Sidebar'
import Header from '../layout/Header'
import BuscaAluno from '../features/alunos/components/BuscaAluno'

export default function AlunoPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Header />
        <BuscaAluno />
      </div>
    </div>
  )
}
