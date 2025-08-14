import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation} from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Loading } from '../../../components/layout/Loading'
import  Popup  from '../../../components/layout/CustomPopUp'

export function LoginPage() {
  const navigate = useNavigate();
  
  const { userData, login, isAuthenticated} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const location = useLocation();
  const state = location.state;

  type PopupType = 'success' | 'error' | null;
  interface PopupState {
    type: PopupType;
    title: string;
    message: string;
    isOpen: boolean;
  }
  

  const apiUrl = import.meta.env.VITE_API_URL;

  const [popup, setPopup] = useState<PopupState>({
      type: null,
      title: '',
      message: '',
      isOpen: false
    });


  
  const setShowPopup = (success: boolean, message: string) => {
    if (!success) {
      setPopup({
        type: 'error',
        title: 'Erro',
        message: message || 'Sessão expirada',
        isOpen: true
      });
    } 
  };
  
  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() =>{
    checkToken()
  },[])

  useEffect(() => {
    if(state?.status == 401){
      setShowPopup(false, state.message)
      cleanStateNavigate()
    }
  }, [location.state])

  const cleanStateNavigate = () =>{
    navigate(".", { replace: true, state: {} });
  }

  const checkToken = async () => {
    if (isAuthenticated) { 
      const isValidToken = await validateToken();
      
      if (isValidToken) { 
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else{
        logout()
      }
    } 
  };
  
  const validateToken = async () =>{
    try {
      const response = await fetch(apiUrl + 'auth/validate', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userData?.token
        },
      });

      if (response.status != 200) {
        return false
      }
    } catch (err) {
      console.error("erro ao validar token: " + err);
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await fetch(apiUrl + 'auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }
  
      login(data); 
      
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      {!isAuthenticated ? (
        <div className="min-h-screen bg-gradient-to-br flex-1 from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-4">
          {popup.isOpen && (
            <Popup
              isOpen={popup.isOpen}
              onClose={closePopup}
              title={popup.title}
              message={popup.message}
              autoCloseTime={4000} 
              position="bottom-right"
              type={popup.type}
            />
          )}
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 relative">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-light text-blue-600 mb-2">
                Sistema ERP
              </h1>
              <p className="text-gray-500">Gestão de Óticas</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 flex items-center justify-center flex-col w-full">
              <div className='w-full'>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-blue-50/50 border border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  placeholder="Digite seu e-mail"
                  required
                  disabled={loading}
                />
              </div>

              <div className='w-full'>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-blue-50/50 border border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    placeholder="Digite sua senha"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-1/2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all transform hover:scale-[1.02] font-medium disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'animate-pulse' : ''}`}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Loading/>
      )}
    </>
  );
}