import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

import './styles.css';

export default function AdminAccessRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/access-requests`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Erro ao buscar solicitações');
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (!confirm(`Tem certeza que deseja ${action === 'approve' ? 'APROVAR' : 'REJEITAR'} esta solicitação?`)) return;

        try {
            const res = await fetch(`${API_BASE_URL}/access-requests/${id}/${action}`, {
                method: 'PUT',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Erro ao processar ação');

            // Atualizar lista
            fetchRequests();
            alert('Ação realizada com sucesso!');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Carregando...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>Erro: {error}</div>;

    return (
        <div className="access-requests-container">
            <h1 className="access-requests-title">Solicitações de Acesso</h1>

            <div className="access-requests-table-container">
                <table className="access-requests-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>RF</th>
                            <th>Cargo</th>
                            <th>Setor</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td>{new Date(req.solicitado_em).toLocaleDateString()}</td>
                                <td>{req.nome_completo}</td>
                                <td>{req.email}</td>
                                <td>{req.registro_funcional} - {req.contador_registro_funcional}</td>
                                <td>{req.cargo}</td>
                                <td>{req.setor}</td>
                                <td>
                                    <span className={`status-badge status-${req.status}`}>
                                        {req.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {req.status === 'pendente' && (
                                        <div className="action-buttons">
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleAction(req.id, 'approve')}
                                            >
                                                Aprovar
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleAction(req.id, 'reject')}
                                            >
                                                Rejeitar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan="8" className="empty-state">
                                    Nenhuma solicitação encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
