import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import {Sidebar} from '../../../components/layout/Sidebar'
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { infosProdutos } from '../services/infosProdutos';
import Popup from "../../../components/layout/CustomPopUp"
import { useNavigate } from 'react-router-dom';
import { ProdutoForm } from '../components/ProdutoForm'

const initialFormData = infosProdutos

type FormInputEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  | { target: { name: 'ativo'; value: boolean } }
  | { target: { name: string; value: string } };

type PopupType = 'success' | 'error' | null;
interface PopupState {
  type: PopupType;
  title: string;
  message: string;
  isOpen: boolean;
}

type Option = { 
  codigo: string;
  descricao: string;
};
 
type TributacaoOpcoes  = {
  cofinsSituacaoTributaria: Option[];
  icmsSituacaoTributaria: Option[];
  ipiSituacaoTributaria: Option[];
  pisSituacaoTributaria: Option[];
};

export function ProdutosCadastro() {
  const [formData, setFormData] = useState(initialFormData);
  const isInitialized = useRef(false);
  const { userData, isAuthenticated, logout } = useAuth();  
  const [infosAdicionais, setInfosAdicionais] = useState(false);
  const [tributacao, setTributacao] = useState<TributacaoOpcoes | null>(null);

  useEffect(()=>{ 
    getOpcoesTributacoes()
  }, [])   
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate() 
   

  const [popup, setPopup] = useState<PopupState>({
    type: null,
    title: '',
    message: '',
    isOpen: false
  });

  const handleApiResponse = (success: boolean, message: string) => {
    if (success) {
      setPopup({
        type: 'success',
        title: 'Sucesso',
        message: 'CLIENTE CADASTRADO COM SUCESSO',
        isOpen: true
      });
    } else {
      setPopup({
        type: 'error',
        title: 'Erro',
        message: message || 'Ocorreu um erro ao cadastrar o cliente',
        isOpen: true
      });
    }
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };
  
  useEffect(() => {
    setFormData({
      ...formData,
      idOtica: String(userData?.id_oticas[0]), //   TODO 
    });
    isInitialized.current = true;
  }, []);  //   TODO: Não captura emailUsuarioCadastro
   
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }
 
  const handleInputChange = async (event: FormInputEvent) => {
    const { name, value } = event.target;

    if (name.includes('.')) {

      setFormData(prev => {
        const keys = name.split('.'); 

        const updated = { ...prev };

        let nested: any = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          nested[keys[i]] = { ...nested[keys[i]] };
          nested = nested[keys[i]];
        }

        nested[keys[keys.length - 1]] = value;

        return updated;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateInfos = () =>{
      
    return true
  }

  const getOpcoesTributacoes = async () =>{
    try {
      const response = await fetch(apiUrl + 'tributacoes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userData?.token
        },
      });

      if (response.status != 200) {
        return false
      }

     const data = await response.json() as TributacaoOpcoes ;

      setTributacao(data)
    } catch (err) {
      console.error("erro ao validar token: " + err);
    }
    return true
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!validateInfos()){
      console.log(formData)
      return 
    }

    try {
      const response = await fetch(apiUrl + 'produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userData?.token
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json()
      const responseMessage = responseData.message || response.statusText || 'Erro ao cadastrar produto';

      handleApiResponse(response.ok, responseMessage)

      setErrorTokenExpirado(response.status)

      if (!response.ok) {
        throw new Error(responseMessage)
      }

      setFormData(initialFormData)
    } catch (err) {
      console.error("error: " + err);
    }
  };

  const setErrorTokenExpirado = (codStatus: number) => {
    if (codStatus == 401){
      logout()
      navigate('/', {state: {status: 401, message: "sessão expirada"}})
    }
  }

  const handleClickInfosAdicionais = () =>{
    setInfosAdicionais(true)
 }

 const handleClickInfosGerais = () =>{
    setInfosAdicionais(false)
 }

  return (
    <div className='flex w-full h-auto min-h-screen'>
      <Sidebar />
      <div className="bg-white-100 p-4 flex-1">
        
        <div className="h-auto rounded-lg shadow-md p-6 ">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Produto</h1>
            <p className="text-muted-foreground">Preencha as informações do produto abaixo</p>
          </div>

          <div className='flex items-center gap-5 mb-5 text-center bg-gray-200 p-1 rounded-lg'>
            <p 
              className={`${infosAdicionais ? "bg-gray-200": "bg-gray-100 "} text-sm font-medium text-gray-700 p-2 w-3/6 cursor-pointer rounded-lg transition duration-300`}
              onClick={handleClickInfosGerais}
            >
              Informações Gerais
            </p>
            <p 
              className={`${infosAdicionais ? "bg-gray-100": "bg-gray-200"} rounded-lg text-sm font-medium text-gray-700 p-2 w-3/6 cursor-pointer duration-300`} 
              onClick={handleClickInfosAdicionais}>
              Informações Adicionais
            </p>
          </div>

          <ProdutoForm
            formData={formData}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            buttonText="Cadastrar"
            infosAdicionais={infosAdicionais}
            tributacao={tributacao}
          />
          {popup.isOpen && (
            <Popup
              isOpen={popup.isOpen}
              onClose={closePopup}
              title={popup.title}
              message={popup.message}
              autoCloseTime={5000} 
              position="bottom-right"
              type={popup.type}
            />
          )}
          

        </div>
      </div>
    </div>
  );
}

export default ProdutosCadastro;