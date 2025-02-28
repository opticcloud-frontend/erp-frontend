import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  dataSession: string | null;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    dataSession: null,
  });

  
  useEffect(() => {
    const dataSession = localStorage.getItem('dataSession');
    if (dataSession) {
      setAuth({
        isAuthenticated: true,
        dataSession,
      });
    }
  }, []); 

  const login = (dataSession: string) => {
    localStorage.setItem('dataSession', dataSession);
    setAuth({
      isAuthenticated: true,
      dataSession,
    });
  };

  const logout = () => {
    localStorage.removeItem('dataSession');
    setAuth({
      isAuthenticated: false,
      dataSession: null,
    });
  };

  return {
    isAuthenticated: auth.isAuthenticated,
    dataSession: auth.dataSession,
    login,
    logout,
  };
}