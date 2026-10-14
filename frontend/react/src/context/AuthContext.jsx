import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => api.getUserInfo());
  const [token, setToken] = useState(() => api.getToken());
  const [loading, setLoading] = useState(true);

  // Sync with backend on startup if token is present
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = api.getToken();
      if (storedToken) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          api.setAuth(storedToken, profile);
        } catch (err) {
          // Token expired or invalid
          api.clearAuth();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password });
    setToken(data.token);
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    setToken(data.token);
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const updated = await authService.updateProfile(updates);
    setUser((prev) => (prev ? { ...prev, ...updated } : updated));
    return updated;
  }, []);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'ADMIN';

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
