import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import {Sidebar} from '../../../components/layout/Sidebar'
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { infosFornecedores } from '../services/fornecedorService';
import { FormatInfos } from '../../../services/FormatInfos';
import { ValidateInfos } from '../../../services/ValidateInfos';
import Popup from "../../../components/layout/CustomPopUp"
import { useNavigate } from 'react-router-dom';
import { OftamologistaForm } from '../components/OftamologistaForm'
import { Header } from '../../../components/layout/Header';
import { Oftalmologista, OftalmologistaForm } from '../types/types';

const initialFormData = infosFornecedores

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

export function OftamologistaCadastro() {
  const [formData, setFormData] = useState(initialFormData);
  const isInitialized = useRef(false);
  const [emailError, setEmailError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
  const { userData, isAuthenticated, logout } = useAuth();  
  
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
        message: 'OFTALMOLOGISTA CADASTRADO COM SUCESSO',
        isOpen: true
      });
    } else {
      setPopup({
        type: 'error',
        title: 'Erro',
        message: message || 'Ocorreu um erro ao cadastrar o oftalmologista',
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
      idOtica: Number(userData?.id_oticas[0])
    });
    isInitialized.current = true;
  }, []); 
   
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }
 
  const validateEmail = (dado: string) =>{
    if (!ValidateInfos.validateEmail(dado)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  }

  const validateTelefone = (dado: string) =>{
    if (!ValidateInfos.validateTelefone(dado)) {
      setTelefoneError('Telefone inválido');
    } else {
      setTelefoneError('');
    }
  }

  const handleInputChange = async (event: FormInputEvent) => {
    const { name, value } = event.target;
    
    let dado: string  = value as string

    if (name == 'telefone'){
      dado = FormatInfos.formatTelefone(value);
      validateTelefone(dado)
    }

    if (name == 'email'){
      validateEmail(dado)
    }

    setFormData(current => ({
      ...current,
      [name]: dado,
    }));
  };

  const validateInfos = () =>{
    if (!ValidateInfos.validateEmail(formData.email) && formData.email != "") { 
      return false;
    }
    
    if (!ValidateInfos.validateTelefone(formData.telefone)) {
      return false;
    }
    
    return true
  }

  const getDIgitosDados =(dados: string) =>{
    return dados.replace(/[^\d]/g, '');
  }

  const convertOftamologistaFormToOftamologista = (form: OftalmologistaForm): Oftalmologista => {
    const idOtica = Number(form.idOtica);

    return {
      idOtica,
      nomeCompleto: form.nomeCompleto,
      crm: form.crm,
      especialidade: form.especialidade,
      telefone: getDIgitosDados(form.telefone),
      email: form.email,
      clinicaHospital: form.clinicaHospital,
      observacoes: form.observacoes,
      status:  form.status,

    };
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!validateInfos()){
      return 
    }

    const fornecedorFinal: Oftalmologista  = convertOftamologistaFormToOftamologista(formData);

    try {
      const response = await fetch(apiUrl + 'oftalmologistas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userData?.token
        },
        body: JSON.stringify(fornecedorFinal),
      });

      const responseData = await response.json()
      const responseMessage = responseData.message || response.statusText || 'Erro ao cadastrar Oftalmologista';

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

  return (
    <div className='flex w-full'>
      <Sidebar />
      <div className="bg-gray-100 p flex-1">
        <Header />
        <div className="rounded-lg p-6">
          <div className="flex py-5 justify-between items-center mb-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                Cadastro de Oftalmologista
              </h2>
              <p className='text-gray-600'>Preencha as informações do médico abaixo</p>
            </div>
          </div>

          <OftamologistaForm
            formData={formData}
            emailError={emailError}
            telefoneError={telefoneError}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            buttonText="Cadastrar"
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

export default OftamologistaCadastro;