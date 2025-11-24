// aee/frontend-aee-vite/src/pages/RequestAccess/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// CORREÇÃO: ../../assets
import logoSistema from '../../assets/logo-sistema.png';

const RequestAccess = () => {
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    {/* Se a imagem quebrar, use o import acima na tag img src={logoSistema} */}
                    <img src="/assets/logo-sistema.png" alt="Logo AEE" className="logo" />
                    <h2>Solicitar Acesso</h2>
                    <p>Entre em contato com a administração.</p>
                </div>

                <div className="login-body">
                    <p>Para solicitar acesso ao sistema, envie um e-mail para:</p>
                    <div className="info-box">
                        <strong>suporte@seducbertioga.com.br</strong>
                    </div>
                    <br />
                    <Link to="/login" className="btn-link">
                        Voltar para o Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RequestAccess;