// aee/frontend-aee-vite/src/pages/Alunos/index.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Alunos.css';

const Alunos = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [filtroSerie, setFiltroSerie] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/alunos/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [token]);

  // Fetch Alunos
  useEffect(() => {
    const fetchAlunos = async () => {
      setLoadingAlunos(true);
      try {
        let url = `http://localhost:3000/alunos?page=${page}&limit=20`;
        if (filtroSerie) url += `&filtro_serie=${encodeURIComponent(filtroSerie)}`;

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAlunos(data.alunos);
          setTotalPages(data.pages);
        }
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      } finally {
        setLoadingAlunos(false);
      }
    };
    fetchAlunos();
  }, [token, filtroSerie, page]);

  // Totais Gerais
  const totalGeral = stats.reduce((acc, curr) => acc + curr.total, 0);
  const totalInfantil = stats.reduce((acc, curr) => acc + curr.infantil, 0);
  const totalFundamental = stats.reduce((acc, curr) => acc + curr.fundamental, 0);

  return (
    <div className="aluno-page-container">
      {/* Dashboard Cards */}
      <div className="stats-dashboard">
        <div className="stat-card total">
          <h3>Total de Alunos</h3>
          <p className="stat-number">{totalGeral}</p>
        </div>
        <div className="stat-card infantil">
          <h3>Educação Infantil</h3>
          <p className="stat-number">{totalInfantil}</p>
        </div>
        <div className="stat-card fundamental">
          <h3>Ensino Fundamental</h3>
          <p className="stat-number">{totalFundamental}</p>
        </div>
      </div>

      {/* Tabela de Estatísticas por Escola */}
      <div className="card table-container">
        <h3>Alunos por Unidade Escolar</h3>
        {loadingStats ? <p>Carregando estatísticas...</p> : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Escola</th>
                  <th>Total</th>
                  <th>Infantil</th>
                  <th>Fundamental</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((item, index) => (
                  <tr key={index}>
                    <td>{item.escola}</td>
                    <td>{item.total}</td>
                    <td>{item.infantil}</td>
                    <td>{item.fundamental}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Listagem de Alunos */}
      <div className="card list-container">
        <div className="list-header">
          <h3>Listagem de Alunos</h3>
          <div className="filters">
            <select
              value={filtroSerie}
              onChange={(e) => { setFiltroSerie(e.target.value); setPage(1); }}
              className="input-select"
            >
              <option value="">Todas as Séries</option>
              <option value="BERÇÁRIO 1">Berçário 1</option>
              <option value="BERÇÁRIO 2">Berçário 2</option>
              <option value="MATERNAL 1">Maternal 1</option>
              <option value="MATERNAL 2">Maternal 2</option>
              <option value="PRÉ-ESCOLA 1">Pré-Escola 1</option>
              <option value="PRÉ-ESCOLA 2">Pré-Escola 2</option>
              <option value="1 ANO">1º Ano</option>
              <option value="2 ANO">2º Ano</option>
              <option value="3 ANO">3º Ano</option>
              <option value="4 ANO">4º Ano</option>
              <option value="5 ANO">5º Ano</option>
            </select>
          </div>
        </div>

        {loadingAlunos ? <p>Carregando alunos...</p> : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>RA</th>
                    <th>Nome</th>
                    <th>Série</th>
                    <th>Turma</th>
                    <th>Escola</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map((aluno) => (
                    <tr key={aluno.ra}>
                      <td>{aluno.ra}-{aluno.dig}</td>
                      <td>{aluno.nome_aluno}</td>
                      <td>{aluno.serie1}</td>
                      <td>{aluno.turma}</td>
                      <td>{aluno.nome_escola}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
              <span>Página {page} de {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Próxima</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Alunos;