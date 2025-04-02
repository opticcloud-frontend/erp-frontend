import { Navigate } from 'react-router-dom';
import {ValidateToken} from '../services/ValidateTokenService'
import { useEffect, useState } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {  
  const validateToken = async () => { // TODO: VERIFICAR MANEIRA MAIS EFICIENTE
    const isValid = await ValidateToken.validate();
    return isValid
  };
  

  if (!validateToken) { 
    return <Navigate to="/" replace />;
  } 

  return <>{children}</>;
}