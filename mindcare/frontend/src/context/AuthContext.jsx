import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('mindcare_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('mindcare_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('mindcare_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('mindcare_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('mindcare_token', newToken);
      localStorage.setItem('mindcare_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.message || 'Login failed.');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('mindcare_token', newToken);
      localStorage.setItem('mindcare_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.message || 'Registration failed.');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mindcare_token');
    localStorage.removeItem('mindcare_user');
  };

  const hasRole = (allowedRoles) => {
    if (!user || !user.role) return false;
    if (typeof allowedRoles === 'string') {
      return user.role.toLowerCase() === allowedRoles.toLowerCase();
    }
    return allowedRoles.some((r) => r.toLowerCase() === user.role.toLowerCase());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        hasRole,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
