// frontend/src/pages/Dashboard/index.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/base.css';
import '../../styles/components.css';
import '../../styles/layout.css';
import '../../styles/variables.css';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import StatSection from '../../components/StatSection';

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
                <StatSection
                    title="Educação Infantil"
                    loading={loading}
                    stats={[
                        { title: "Berçário", value: stats.bercario, label: "Turmas" },
                        { title: "Maternal", value: stats.maternal, label: "Turmas" },
                        { title: "Pré-Escola", value: stats.pre, label: "Turmas" }
                    ]}
                />

                <StatSection
                    title="Ensino Fundamental"
                    loading={loading}
                    stats={[
                        { title: "1º Ano", value: stats.ano1, label: "Turmas" },
                        { title: "2º Ano", value: stats.ano2, label: "Turmas" },
                        { title: "3º Ano", value: stats.ano3, label: "Turmas" },
                        { title: "4º Ano", value: stats.ano4, label: "Turmas" },
                        { title: "5º Ano", value: stats.ano5, label: "Turmas" }
                    ]}
                />

                <StatSection
                    title="EJA"
                    loading={loading}
                    stats={[
                        { title: "EJA 1", value: stats.eja1, label: "Turmas" },
                        { title: "EJA 2", value: stats.eja2, label: "Turmas" }
                    ]}
                />

                <StatSection
                    title="Educação Especial"
                    loading={loading}
                    stats={[
                        { title: "AEE", value: stats.aee, label: "Turmas" },
                        { title: "EEE", value: stats.eee, label: "Turmas" }
                    ]}
                />
            </div>
        </div>
    );
};

export default Dashboard;