//aee/frontend-aee/src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import jwtDecode from 'jwt-decode';

const AuthContext = createContext();
const LOCAL_STORAGE_KEY = 'aee_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega sessão do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      validateSession(parsed.token);
    } else {
      setLoading(false);
    }
  }, []);

  // Valida token no backend
  const validateSession = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios/me', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
      });
      if (!response.ok) throw new Error('Sessão inválida');
      const data = await response.json();
      setUser({ ...data.user, token });
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Função de login
  const login = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || 'Usuário não autorizado');
      }
      const data = await response.json();
      const userData = { ...data.user, token: credentialResponse.credential };
      setUser(userData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
      setError(null);
    } catch (e) {
      setError(e.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
