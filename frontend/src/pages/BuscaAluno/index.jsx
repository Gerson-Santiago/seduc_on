// frontend/src/pages/BuscaAluno/index.jsx

import React, { useState } from 'react';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import './BuscaAluno.css';

const BuscaAluno = () => {
    const { user } = useAuth(); // Changed from token to user, although not strictly used here, good practice. Or could just remove.

    // Estados de busca
    const [ra, setRa] = useState('');
    const [nome, setNome] = useState('');
    const [escola, setEscola] = useState('');
    const [serie, setSerie] = useState('');
    const [anoLetivo, setAnoLetivo] = useState('2025'); // Ano atual como padrão

    // Estados de resultados
    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lista de anos letivos disponíveis (pode ser dinâmico)
    const anosLetivos = ['2025', '2024', '2023', '2022', '2021'];

    const handleBuscar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setAluno(null);

        try {
            let url = `${API_BASE_URL}/alunos`;
            const params = new URLSearchParams();

            if (ra) params.append('ra', ra);
            if (nome) params.append('nome', nome);
            if (escola) params.append('escola', escola);
            if (serie) params.append('filtro_serie', serie);
            // TODO: Adicionar filtro por ano letivo quando backend estiver pronto

            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;

            const response = await fetch(url, {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();

                // Se buscar por RA, retorna um único aluno
                if (ra && !data.alunos) {
                    setAluno(data);
                } else if (data.alunos && data.alunos.length > 0) {
                    // Se buscar por outros filtros, pega o primeiro resultado
                    setAluno(data.alunos[0]);
                } else {
                    setError('Nenhum aluno encontrado com os critérios informados.');
                }
            } else {
                setError('Aluno não encontrado ou erro na busca.');
            }
        } catch (err) {
            console.error('Erro ao buscar aluno:', err);
            setError('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handleLimpar = () => {
        setRa('');
        setNome('');
        setEscola('');
        setSerie('');
        setAnoLetivo('2025');
        setAluno(null);
        setError(null);
    };

    const formatarData = (dataString) => {
        if (!dataString) return 'Não informado';
        try {
            const data = new Date(dataString);
            return data.toLocaleDateString('pt-BR');
        } catch {
            return dataString;
        }
    };

    return (
        <div className="busca-aluno-container">
            <h1 className="page-title">Busca de Aluno</h1>

            {/* Formulário de Busca */}
            <div className="card search-card">
                <h2>Filtros de Busca</h2>
                <form onSubmit={handleBuscar} className="search-form">
                    <div className="form-grid">
                        {/* RA */}
                        <div className="form-group">
                            <label htmlFor="ra">RA do Aluno</label>
                            <input
                                type="text"
                                id="ra"
                                value={ra}
                                onChange={(e) => setRa(e.target.value)}
                                placeholder="Digite o RA"
                                className="form-input"
                            />
                        </div>

                        {/* Nome */}
                        <div className="form-group">
                            <label htmlFor="nome">Nome do Aluno</label>
                            <input
                                type="text"
                                id="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Digite o nome"
                                className="form-input"
                            />
                        </div>

                        {/* Escola */}
                        <div className="form-group">
                            <label htmlFor="escola">Escola</label>
                            <input
                                type="text"
                                id="escola"
                                value={escola}
                                onChange={(e) => setEscola(e.target.value)}
                                placeholder="Digite o nome da escola"
                                className="form-input"
                            />
                        </div>

                        {/* Série */}
                        <div className="form-group">
                            <label htmlFor="serie">Série</label>
                            <select
                                id="serie"
                                value={serie}
                                onChange={(e) => setSerie(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Todas as Séries</option>
                                <option value="BERÇARIO 1">Berçário 1</option>
                                <option value="BERÇARIO 2">Berçário 2</option>
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

                        {/* Ano Letivo */}
                        <div className="form-group">
                            <label htmlFor="anoLetivo">Ano Letivo</label>
                            <select
                                id="anoLetivo"
                                value={anoLetivo}
                                onChange={(e) => setAnoLetivo(e.target.value)}
                                className="form-select"
                            >
                                {anosLetivos.map(ano => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                        <button type="button" onClick={handleLimpar} className="btn btn-secondary">
                            Limpar
                        </button>
                    </div>
                </form>
            </div>

            {/* Mensagem de Erro */}
            {error && (
                <div className="card error-card">
                    <p className="error-message">{error}</p>
                </div>
            )}

            {/* Resultado da Busca */}
            {aluno && (
                <div className="card result-card">
                    <h2>Dados do Aluno</h2>

                    <div className="aluno-details">
                        {/* Informações Pessoais */}
                        <section className="info-section">
                            <h3>Informações Pessoais</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Nome:</span>
                                    <span className="info-value">{aluno.nome_aluno || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">RA:</span>
                                    <span className="info-value">{aluno.ra}{aluno.dig ? `-${aluno.dig}` : ''}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Data de Nascimento:</span>
                                    <span className="info-value">{formatarData(aluno.data_nasci)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Gênero:</span>
                                    <span className="info-value">
                                        {aluno.genero === 'M' ? 'Masculino' : aluno.genero === 'F' ? 'Feminino' : 'Não informado'}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Etnia:</span>
                                    <span className="info-value">{aluno.etnia || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">UF:</span>
                                    <span className="info-value">{aluno.uf || 'Não informado'}</span>
                                </div>
                            </div>
                        </section>

                        {/* Informações Acadêmicas */}
                        <section className="info-section">
                            <h3>Informações Acadêmicas</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Escola:</span>
                                    <span className="info-value">{aluno.nome_escola || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Código da Escola:</span>
                                    <span className="info-value">{aluno.cod_escola || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">INEP:</span>
                                    <span className="info-value">{aluno.inep || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Tipo de Ensino:</span>
                                    <span className="info-value">{aluno.tipo_de_ensino || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Série:</span>
                                    <span className="info-value">{aluno.serie1 || aluno.filtro_serie || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Turma:</span>
                                    <span className="info-value">{aluno.turma || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Código da Turma:</span>
                                    <span className="info-value">{aluno.cod_turma || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Período:</span>
                                    <span className="info-value">{aluno.periodo || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Nº de Chamada:</span>
                                    <span className="info-value">{aluno.n_chamada || 'Não informado'}</span>
                                </div>
                            </div>
                        </section>

                        {/* Situação e Datas */}
                        <section className="info-section">
                            <h3>Situação e Datas</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Situação:</span>
                                    <span className={`info-value status-${aluno.situacao?.toLowerCase()}`}>
                                        {aluno.situacao || 'Não informado'}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Data Inicial:</span>
                                    <span className="info-value">{formatarData(aluno.data_inicial)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Data Fim:</span>
                                    <span className="info-value">{formatarData(aluno.data_fim)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Data Movimentação:</span>
                                    <span className="info-value">{formatarData(aluno.data_movimentacao)}</span>
                                </div>
                            </div>
                        </section>

                        {/* Outras Informações */}
                        <section className="info-section">
                            <h3>Outras Informações</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Deficiência:</span>
                                    <span className="info-value">{aluno.deficiencia || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Transporte:</span>
                                    <span className="info-value">{aluno.transporte || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Endereço:</span>
                                    <span className="info-value">{aluno.endereco || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Telefone:</span>
                                    <span className="info-value">{aluno.telefone || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Email do Aluno:</span>
                                    <span className="info-value">{aluno.email_aluno || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Nome do Responsável:</span>
                                    <span className="info-value">{aluno.nome_responsavel || 'Não informado'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Professor:</span>
                                    <span className="info-value">{aluno.prof1 || 'Não informado'}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuscaAluno;
