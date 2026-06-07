import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem('tb_token'));
  const [admin, setAdmin]   = useState(() => localStorage.getItem('tb_admin'));
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get('/auth/verify')
      .then(res => { setAdmin(res.data.username); })
      .catch(() => { logout(); })
      .finally(() => setLoading(false));
  }, []);

  function login(newToken, username) {
    localStorage.setItem('tb_token', newToken);
    localStorage.setItem('tb_admin', username);
    setToken(newToken);
    setAdmin(username);
  }

  function logout() {
    localStorage.removeItem('tb_token');
    localStorage.removeItem('tb_admin');
    setToken(null);
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ token, admin, loading, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
