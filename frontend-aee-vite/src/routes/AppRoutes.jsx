// aee/frontend-aee-vite/src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Componentes
import AuthCallback from '../components/AuthCallback';

// Páginas Organizadas
import Home from '../pages/Home/index';            // <--- Home Reativada
import Login from '../pages/Login/index';
import RequestAccess from '../pages/RequestAccess/index';
import Dashboard from '../pages/Dashboard/index';
import Alunos from '../pages/Alunos/index';
import Escolas from '../pages/Escolas/index';

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

            {/* --- Rotas Protegidas (Dentro do Sistema) --- */}
            <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/alunos" element={<Alunos />} />
                <Route path="/escolas" element={<Escolas />} />

                {/* Se alguém tentar acessar /aee, manda para o Dashboard (ou Home, você decide) */}
                <Route path="/aee" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Rota 404 */}
            <Route path="*" element={<div>404 - Página não encontrada</div>} />
        </Routes>
    );
};

export default AppRoutes;