import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
    }

    // Verifica se o usuário está logado e se tem perfil de admin ou superadmin
    if (user && (user.perfil === 'admin' || user.perfil === 'superadmin')) {
        return <Outlet />;
    }

    // Se não for admin, redireciona para o dashboard (ou login)
    return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
