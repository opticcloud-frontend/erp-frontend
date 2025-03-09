import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('dataSession');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  

  let isAuthenticated = !!userData;

  useEffect(() => {
    if (userData) {
      localStorage.setItem('dataSession', JSON.stringify(userData));
    } else {
      localStorage.removeItem('dataSession');
    }
  }, [userData]);

  const login = (user: User) => {
    setUserData(user);
  };
  

  const logout = () => {
    isAuthenticated = false
    localStorage.removeItem('dataSession');
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userData, }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}