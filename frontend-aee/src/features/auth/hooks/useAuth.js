//aee/frontend-aee/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loginErro, setLoginErro] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const onLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      if (!email.endsWith('@seducbertioga.com.br')) {
        setLoginErro('Domínio não permitido');
        return;
      }

      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setLoginErro('Usuário não autorizado');
        return;
      }

      const data = await response.json();
      const userData = { ...decoded, role: data.usuario.role };

      setUser(userData);
      setLoginErro(null);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
      setLoginErro('Erro ao processar login');
    }
  };

  const onLoginError = () => setLoginErro('Falha no login com Google');

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, loginErro, onLoginSuccess, onLoginError, logout };
}
