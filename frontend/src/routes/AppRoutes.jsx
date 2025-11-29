// frontend/src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../components/layout/MainLayout';

// Componentes
import AuthCallback from '../components/AuthCallback';

// Páginas Organizadas
import Home from '../pages/Home/index';
import Login from '../pages/Login/index';
import RequestAccess from '../pages/RequestAccess/index';
import Dashboard from '../pages/Dashboard/index';
import Alunos from '../pages/Alunos/index';
import Professores from '../pages/Professores/index';
import Escolas from '../pages/Escolas/index';
import Turmas from '../pages/Turmas/index';
import Usuarios from '../pages/Usuarios/index';
import Calendario from '../pages/Calendario/index';
import Configuracoes from '../pages/Configuracoes/index';
import StatusPage from '../pages/Status/index';

const AppRoutes = () => {
    return (
        <Routes>
            {/* --- Rotas Públicas --- */}

            {/* Home é a nova raiz "/" */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/solicitar-acesso" element={<RequestAccess />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/aee/auth/callback" element={<AuthCallback />} />
            <Route path="/status" element={<StatusPage />} />

            {/* --- Rotas Protegidas (Dentro do Sistema) --- */}
            <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/alunos" element={<Alunos />} />
                <Route path="/professores" element={<Professores />} />
                <Route path="/escolas" element={<Escolas />} />
                <Route path="/turmas" element={<Turmas />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/calendario" element={<Calendario />} />
                <Route path="/configuracoes" element={<Configuracoes />} />

                {/* Se alguém tentar acessar /aee, manda para o Dashboard (ou Home, você decide) */}
                <Route path="/aee" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Rota 404 */}
            <Route path="*" element={<div>404 - Página não encontrada</div>} />
        </Routes>
    );
};

export default AppRoutes;