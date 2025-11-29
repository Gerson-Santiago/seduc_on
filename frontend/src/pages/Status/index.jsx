// frontend/src/pages/Status/index.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../context/AuthContext';
import { Activity, Database, Server, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import './Status.css';



const StatusPage = () => {
  const [status, setStatus] = useState({ backend: 'verificando', database: 'verificando' });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const checkStatus = async () => {
    setLoading(true);
    // Simula delay natural
    await new Promise(r => setTimeout(r, 800));

    try {
      // Tenta fetch real
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error('Falha na API');
      const data = await response.json();
      setStatus({
        backend: data.backend || 'offline',
        database: data.database || 'offline',
      });
    } catch (error) {
      // Em caso de erro de rede ou falha na API, define ambos como offline
      setStatus({
        backend: 'offline',
        database: 'offline'
      });
    } finally {
      setLastUpdate(new Date());
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const allOnline = status.backend === 'online' && status.database === 'online';

  return (
    <div className="modern-dashboard">
      <div className="dashboard-container fade-in">

        {/* Layout em Grid Responsivo: 3 Colunas (como na imagem) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* COLUNA 1: Cabeçalho e Status Global (Ocupa 5 colunas) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Activity size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Status dos Serviços
                </h1>
                <p className="text-slate-500 font-medium">
                  Monitoramento em tempo real
                </p>
              </div>
            </div>

            {/* Alerta de Status Global */}
            <div className={`
              flex items-start gap-3 p-4 rounded-xl border transition-colors duration-300
              ${allOnline
                ? 'bg-green-50 border-green-100 text-green-800'
                : 'bg-red-50 border-red-100 text-red-800'}
            `}>
              {allOnline ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <div>
                <h3 className="font-bold text-lg">
                  {allOnline ? 'Tudo operando normalmente' : 'Alguns serviços com problemas'}
                </h3>
                <p className={`text-sm mt-1 opacity-90 ${allOnline ? 'text-green-700' : 'text-red-700'}`}>
                  {allOnline
                    ? 'Todos os sistemas estão funcionais e respondendo.'
                    : 'A equipe técnica já foi notificada sobre a instabilidade.'}
                </p>
              </div>
            </div>
          </div>

          {/* COLUNA 2: Ações (Centro - Ocupa 2 colunas) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center h-full pt-4">
            <button
              onClick={checkStatus}
              disabled={loading}
              className="btn-modern group w-full justify-center"
            >
              <RefreshCw
                size={20}
                className={`transition-transform duration-700 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`}
              />
              <span>{loading ? 'Atualizando...' : 'Atualizar'}</span>
            </button>
          </div>

          {/* COLUNA 3: Lista de Status (Direita - Ocupa 5 colunas) */}
          <div className="lg:col-span-5 space-y-4 border-l border-slate-100 lg:pl-10">
            {lastUpdate && (
              <div className="text-right mb-6 text-sm font-medium text-slate-400">
                Última verificação: {lastUpdate.toLocaleTimeString('pt-BR')}
              </div>
            )}

            {/* Item 1: Backend */}
            <div className={`status-item ${status.backend === 'online' ? 'status-online' : 'status-offline'}`}>
              <div className="status-icon-box">
                <Server size={24} />
              </div>
              <div>
                <div className="text-label">API Backend</div>
                <div className="text-value flex items-center gap-2">
                  {status.backend === 'online' ? 'Operacional' : 'Fora do Ar'}
                </div>
              </div>
            </div>

            {/* Item 2: Database */}
            <div className={`status-item ${status.database === 'online' ? 'status-online' : 'status-offline'}`}>
              <div className="status-icon-box">
                <Database size={24} />
              </div>
              <div>
                <div className="text-label">Banco de Dados</div>
                <div className="text-value flex items-center gap-2">
                  {status.database === 'online' ? 'Operacional' : 'Instabilidade'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;