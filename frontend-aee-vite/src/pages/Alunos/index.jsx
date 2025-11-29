// aee/frontend-aee-vite/src/pages/Alunos/index.jsx
import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import './Alunos.css';

const Alunos = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({ global: {}, schools: [] });
  const [alunos, setAlunos] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [filtroSerie, setFiltroSerie] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros da Tabela de Escolas
  const [filtroNivel, setFiltroNivel] = useState('TODOS'); // TODOS, INFANTIL, FUNDAMENTAL
  const [filtroPreEscola, setFiltroPreEscola] = useState(false); // Checkbox para "Apenas Pré-escola"

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/alunos/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          // Backend agora retorna { global: {...}, schools: [...] }
          // Se ainda retornar array (cache antigo), tratamos
          if (Array.isArray(data)) {
            setStats({ global: {}, schools: data });
          } else {
            setStats(data);
          }
        } else {
          console.error('Falha ao buscar stats:', response.status);
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
        let url = `${API_BASE_URL}/alunos?page=${page}&limit=20`;
        if (filtroSerie) url += `&filtro_serie=${encodeURIComponent(filtroSerie)}`;

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAlunos(data.alunos);
          setTotalPages(data.pages);
        } else {
          console.error('Falha ao buscar alunos:', response.status);
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
  const schools = stats.schools || [];
  const global = stats.global || {};

  const totalGeral = schools.reduce((acc, curr) => acc + curr.total, 0);
  const totalInfantil = schools.reduce((acc, curr) => acc + curr.infantil, 0);
  const totalFundamental = schools.reduce((acc, curr) => acc + curr.fundamental, 0);

  // Filtragem da Tabela de Escolas
  const filteredSchools = schools.filter(school => {
    if (filtroNivel === 'INFANTIL') {
      if (school.infantil === 0) return false;
      if (filtroPreEscola && school.pre_escola === 0) return false;
      return true;
    }
    if (filtroNivel === 'FUNDAMENTAL') {
      return school.fundamental > 0;
    }
    return true;
  });

  return (
    <div className="aluno-page-container">
      <h1 className="page-title">Quantitativo de aluno na Educação municipal de Bertioga</h1>

      {/* Dashboard Cards - Linha 1: Totais Gerais */}
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

      {/* Dashboard Cards - Linha 2: Detalhe por Série Agrupado */}
      <div className="stats-groups-container">

        {/* Grupo Berçário */}
        <div className="stats-group">
          <h4>Berçário</h4>
          <div className="group-cards">
            <div className="stat-card year-card total-sub">
              <h3>Total</h3>
              <p className="stat-number">{(global.bercario_1 || 0) + (global.bercario_2 || 0)}</p>
            </div>
            {[
              { label: 'Berçário 1', key: 'bercario_1', filter: 'BERÇARIO 1' },
              { label: 'Berçário 2', key: 'bercario_2', filter: 'BERÇARIO 2' },
            ].map(card => (
              <div
                key={card.key}
                className={`stat-card year-card ${filtroSerie === card.filter ? 'active' : ''}`}
                onClick={() => setFiltroSerie(filtroSerie === card.filter ? '' : card.filter)}
              >
                <h3>{card.label}</h3>
                <p className="stat-number">{global[card.key] || 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grupo Maternal */}
        <div className="stats-group">
          <h4>Maternal</h4>
          <div className="group-cards">
            <div className="stat-card year-card total-sub">
              <h3>Total</h3>
              <p className="stat-number">{(global.maternal_1 || 0) + (global.maternal_2 || 0)}</p>
            </div>
            {[
              { label: 'Maternal 1', key: 'maternal_1', filter: 'MATERNAL 1' },
              { label: 'Maternal 2', key: 'maternal_2', filter: 'MATERNAL 2' },
            ].map(card => (
              <div
                key={card.key}
                className={`stat-card year-card ${filtroSerie === card.filter ? 'active' : ''}`}
                onClick={() => setFiltroSerie(filtroSerie === card.filter ? '' : card.filter)}
              >
                <h3>{card.label}</h3>
                <p className="stat-number">{global[card.key] || 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grupo Pré-Escola */}
        <div className="stats-group">
          <h4>Pré-Escola</h4>
          <div className="group-cards">
            <div className="stat-card year-card total-sub">
              <h3>Total</h3>
              <p className="stat-number">{(global.pre_escola_1 || 0) + (global.pre_escola_2 || 0)}</p>
            </div>
            {[
              { label: 'Pré-Escola 1', key: 'pre_escola_1', filter: 'PRÉ-ESCOLA 1' },
              { label: 'Pré-Escola 2', key: 'pre_escola_2', filter: 'PRÉ-ESCOLA 2' },
            ].map(card => (
              <div
                key={card.key}
                className={`stat-card year-card ${filtroSerie === card.filter ? 'active' : ''}`}
                onClick={() => setFiltroSerie(filtroSerie === card.filter ? '' : card.filter)}
              >
                <h3>{card.label}</h3>
                <p className="stat-number">{global[card.key] || 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grupo Fundamental */}
        <div className="stats-group">
          <h4>Ensino Fundamental</h4>
          <div className="group-cards">
            {[
              { label: '1º Ano', key: 'ano_1', filter: '1 ANO' },
              { label: '2º Ano', key: 'ano_2', filter: '2 ANO' },
              { label: '3º Ano', key: 'ano_3', filter: '3 ANO' },
              { label: '4º Ano', key: 'ano_4', filter: '4 ANO' },
              { label: '5º Ano', key: 'ano_5', filter: '5 ANO' },
            ].map(card => (
              <div
                key={card.key}
                className={`stat-card year-card ${filtroSerie === card.filter ? 'active' : ''}`}
                onClick={() => setFiltroSerie(filtroSerie === card.filter ? '' : card.filter)}
              >
                <h3>{card.label}</h3>
                <p className="stat-number">{global[card.key] || 0}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Tabela de Estatísticas por Escola */}
      <div className="card table-container">
        <div className="table-header-actions">
          <h3>Alunos por Unidade Escolar</h3>

          <div className="table-filters">
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="filter-select"
            >
              <option value="TODOS">Todas as Escolas</option>
              <option value="INFANTIL">Educação Infantil</option>
              <option value="FUNDAMENTAL">Ensino Fundamental</option>
            </select>

            {filtroNivel === 'INFANTIL' && (
              <label className="checkbox-filter">
                <input
                  type="checkbox"
                  checked={filtroPreEscola}
                  onChange={(e) => setFiltroPreEscola(e.target.checked)}
                />
                Apenas Pré-escola
              </label>
            )}
          </div>
        </div>

        {loadingStats ? <p>Carregando estatísticas...</p> : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Escola</th>
                  <th>Total</th>
                  <th>Infantil</th>
                  <th>Fundamental</th>
                  {filtroNivel === 'INFANTIL' && <th>Pré-escola</th>}
                </tr>
              </thead>
              <tbody>
                {filteredSchools.map((item, index) => (
                  <tr key={index}>
                    <td>{item.escola}</td>
                    <td>{item.total}</td>
                    <td>{item.infantil}</td>
                    <td>{item.fundamental}</td>
                    {filtroNivel === 'INFANTIL' && <td>{item.pre_escola}</td>}
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