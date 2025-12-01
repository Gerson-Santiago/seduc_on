// frontend/src/pages/Dashboard/index.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/base.css';
import '../../styles/components.css';
import '../../styles/layout.css';
import '../../styles/variables.css';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        bercario: 0,
        maternal: 0,
        pre: 0,
        ano1: 0,
        ano2: 0,
        ano3: 0,
        ano4: 0,
        ano5: 0,
        eja1: 0,
        eja2: 0,
        aee: 0,
        eee: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = user?.token || JSON.parse(localStorage.getItem('seduc_on_user'))?.token;
                if (!token) return;

                console.log('Fetching stats from:', `${API_BASE_URL}/escolas/stats`);
                const response = await fetch(`${API_BASE_URL}/escolas/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log('Response status:', response.status);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Stats data:', data);
                    setStats(data);
                } else {
                    console.error('Fetch failed:', await response.text());
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    return (
        <div className="dashboard-view">
            <h1 className="page-title">Painel Geral</h1>

            <div className="card">
                <p>
                    Bem-vindo ao seu painel! Abaixo estão os dados das escolas de Bertioga.
                </p>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--text-secondary)' }}>Educação Infantil</h2>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>Berçário</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.bercario}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>Maternal</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.maternal}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>Pré-Escola</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.pre}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px', color: 'var(--text-secondary)' }}>Ensino Fundamental</h2>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>1º Ano</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.ano1}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>2º Ano</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.ano2}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>3º Ano</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.ano3}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>4º Ano</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.ano4}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>5º Ano</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.ano5}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px', color: 'var(--text-secondary)' }}>EJA</h2>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>EJA 1</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.eja1}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>EJA 2</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.eja2}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px', color: 'var(--text-secondary)' }}>Educação Especial</h2>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>AEE</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.aee}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>EEE</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : stats.eee}</p>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Turmas</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;