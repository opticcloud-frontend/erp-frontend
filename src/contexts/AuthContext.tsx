import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
  id_oticas: [];
  token: string;
}


interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  userData: User ;
  setUserData: (data: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, dataSession, login, logout } = useAuth();
  const [userData, setUserData] = useState<User | null>(() => {
    // Recupera os dados do usuário do localStorage ao carregar a página
    const storedUser = localStorage.getItem('dataSession');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (userData) {
      localStorage.setItem('dataSession', JSON.stringify(userData));
    } else {
      localStorage.removeItem('dataSession');
    }
  }, [userData]);

  const handleLogout = () => {
    logout();
    setUserData(null);
    localStorage.removeItem('userData');
  };

  const value = {
    isAuthenticated,
    dataSession,
    login,
    logout,
    userData,
    setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}