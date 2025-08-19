import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, AuthContextType, Cliente } from '../types/auth';
import { Produto } from '../features/produtos/types/produto';
import { Fornecedor } from '../features/fornecedores/types/types';
 

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('dataSession');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [clienteData, setClienteData] = useState<Cliente | undefined>(undefined)
  const [produtoData, setProdutoData] = useState<Produto | undefined>(undefined)
  const [fornecedorData, setFornecedorData] = useState<Fornecedor | undefined>(undefined)

  const removeCliente = () => {
    setClienteData(undefined);
  };

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

  const setCliente = (cliente: Cliente) =>{
    setClienteData(cliente)
  }
  

  const logout = () => {
    isAuthenticated = false
    localStorage.removeItem('dataSession');
    setUserData(null);
    removeCliente()
  };

  return (
    <AuthContext.Provider value={
      { isAuthenticated, 
        login, 
        logout, 
        userData, 
        setClienteData, 
        clienteData, 
        produtoData, 
        setProdutoData,
        fornecedorData, 
        setFornecedorData  
      }
    }>
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