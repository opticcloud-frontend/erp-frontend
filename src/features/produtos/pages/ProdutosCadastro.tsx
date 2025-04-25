import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import {Sidebar} from '../../../components/layout/Sidebar'
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { infosProdutos } from '../services/infosProdutos';
import { FormatInfos } from './../../../services/FormatInfos';
import { ValidateInfos } from '../../../services/ValidateInfos';
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

export function ProdutosCadastro() {
  const [formData, setFormData] = useState(initialFormData);
  const isInitialized = useRef(false);
  const { userData, isAuthenticated, logout } = useAuth();  
  const [infosAdicionais, setInfosAdicionais] = useState(false);
  
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
      oticaId: String(userData?.id_oticas[0]), //   TODO 
    });
    isInitialized.current = true;
  }, []);  //   TODO: Não captura emailUsuarioCadastro
   
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }
 
  const handleInputChange = async (event: FormInputEvent) => {
    const { name, value } = event.target;

    setFormData(current => ({
      ...current,
      [name]: value,
    }));
  };

  const validateInfos = () =>{
    
    return false
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
    <div className='flex w-full'>
      <Sidebar />
      <div className="bg-white-100 p-4 flex-1">
        <div className="h-auto rounded-lg shadow-md p-6 ">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 ">
              <h2 className="text-2xl font-semibold text-gray-800">
                Cadastro de Produto
              </h2>
            </div>
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