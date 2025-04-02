import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Sidebar } from '../../layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { infosClientes, infos_metodos_pagamentos } from '../../services/infosClientes';
import { FormatInfos } from '../../services/FormatInfos';
import { ValidateInfos } from '../../services/ValidateInfos';
import Popup from "../../layout/CustomPopUp";
import { useNavigate } from 'react-router-dom';
import { ClientForm } from '../../layout/Form'

const METODOS_PAGAMENTO = infos_metodos_pagamentos;
const initialFormData = infosClientes

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

export function ClientesCadastro() {
  const [formData, setFormData] = useState(initialFormData);
  const isInitialized = useRef(false);
  const [documentoError, setDocumentoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
  const [displayDocumento, setDisplayDocumento] = useState(''); 
  const { userData, isAuthenticated, logout } = useAuth();  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()
  

  const [popup, setPopup] = useState<PopupState>({
    type: null,
    title: '',
    message: '',
    isOpen: false
  });

  const handleBlurCNPJ = async (event: FormInputEvent) => {
    const inputValue = typeof event.target.value === 'string' ? event.target.value : '';
    const cnpj = inputValue.replace(/\D/g, ''); 

    if(!cnpj){
      return
    }

    const data = await fetchCNPJData(cnpj);
    if(data){
      data.enderecoCep = FormatInfos.formatCep(data.enderecoCep);
      data.telefone = FormatInfos.formatTelefone(data.telefone);

      setFormData(prev => ({
        ...prev,
        ...data
      }));
    }
  };

  const handleBlurCEP = async (event: FormInputEvent) => {
    const inputValue = typeof event.target.value === 'string' ? event.target.value : '';
    const cep = inputValue.replace(/\D/g, '');

    if(!cep){
      return
    }

    const data = await fetchCEPData(cep);

    if(data){
      data.enderecoCep = FormatInfos.formatCep(data.enderecoCep);
  
      setFormData(prev => ({
        ...prev,
        ...data
      }));
    }
  };

  const fetchCNPJData = async (cnpj: string) => {
    try {
      if(!cnpj){
        return
      }
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (!response.ok) {
        throw new Error('CNPJ não encontrado');
      }
      const data = await response.json();
      
      return {
        razaoSocial: data.razao_social,
        email: data.email || '',
        enderecoLogradouro: data.logradouro,
        enderecoNumero: data.numero,
        enderecoCidade: data.municipio,
        enderecoBairro: data.bairro,
        nomeFantasia: data.nome_fantasia,
        enderecoComplemento: data.complemento,
        enderecoCep: data.cep,
        telefone: data.ddd_telefone_1,
      };
    } catch (error) {
      console.error('Erro ao buscar dados do CNPJ ', error);
    }
  };

  const fetchCEPData = async (cep: string) => {
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      if (!response.ok) { 
        throw new Error('CEP não encontrado');
      }

      const data = await response.json();      
      
      return {
        enderecoBairro: data.neighborhood,
        enderecoCidade: data.city,
        enderecoCep: data.cep, 
      }; 
    } catch (error) {
      console.error('Erro ao buscar dados do CEP ', error);
    }
  };

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
      emailUsuarioCadastro: userData?.email ?? "",
      oticaId: String(userData?.id_oticas[0]), //   TODO 
    });
    isInitialized.current = true;
  }, []);  //   TODO: Não captura emailUsuarioCadastro
   
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }
 
  const handleInputChangeDocumento = async (
    e: ChangeEvent<HTMLInputElement>
  ) =>{
    const {value} = e.target;
    const documentoDigitos = value.replace(/\D/g, '');
    let formattedDoc = '';

    if (formData.tipoCliente === 'PESSOA_FISICA') {
      formattedDoc = FormatInfos.formatCPF(value);
      setDisplayDocumento(formattedDoc);

      if (!value) {
        setDocumentoError('');
      }

      if (!ValidateInfos.validateCPF(documentoDigitos)) { 
        setDocumentoError('CPF inválido'); 
      } else {
        setDocumentoError('');
      }
    } else {
      formattedDoc = FormatInfos.formatCNPJ(value);
      setDisplayDocumento(formattedDoc);
    }

    setFormData(current => ({
      ...current,
      documento: documentoDigitos,
    }));
  }

  const handleInputChangeEmailCliente = (
    e: ChangeEvent<HTMLInputElement> 
  ) => {
    const {name, value } = e.target;

    setFormData(current => ({
      ...current,
      [name]: value,
    }));

    if (!value) {
      setEmailError('');
      return;
    }

    if (!ValidateInfos.validateEmail(value)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  }

  const handleInputChangeTelefeone = (
    e: ChangeEvent<HTMLInputElement> 
  ) => {
    const { name, value } = e.target;

    const formattedTelefone = FormatInfos.formatTelefone(value);

    if (!ValidateInfos.validateTelefone(formattedTelefone)) {
      setTelefoneError('Telefone inválido');
    } else {
      setTelefoneError('');
    }

    setFormData(current => ({
      ...current,
      [name]: formattedTelefone,
    }));
  }

  const handleInputChangeEnderecoCep = (
    e: ChangeEvent<HTMLInputElement> 
  ) => {
    const { name, value } = e.target;

    const formattedCEP = FormatInfos.formatCep(value);

    setFormData(current => ({
      ...current,
      [name]: formattedCEP,
    }));
  }

  const handleInputChange = async (event: FormInputEvent) => {
    const { name, value } = event.target;

    setFormData(current => ({
      ...current,
      [name]: value,
    }));
  };

  const validateInfos = () =>{
    if (formData.tipoCliente === 'PESSOA_FISICA' && !ValidateInfos.validateCPF(formData.documento)) {
      setDocumentoError('CPF inválido');
      return false;
    }
    
    if (!ValidateInfos.validateEmail(formData.emailCliente)) { 
      setEmailError('E-mail inválido');
      return false;
    }
    
    if (!ValidateInfos.validateTelefone(formData.telefone)) {
      setTelefoneError('Telefone inválido');
      return false;
    }
    
    return true
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!validateInfos()){
      return 
    }

    try {
      const response = await fetch(apiUrl + 'clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userData?.token
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json()
      const responseMessage = responseData.message || response.statusText || 'Erro ao cadastrar cliente';

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
      <div className="min-h-screen bg-gray-100 p-4 flex-1">
        <div className="bg-white rounded-lg shadow-md p-6 ">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                Cadastro de Cliente
              </h2>
            </div>
          </div>

          <ClientForm
            formData={formData}
            documentoError={documentoError}
            emailError={emailError}
            telefoneError={telefoneError}
            displayDocumento={displayDocumento}
            METODOS_PAGAMENTO={METODOS_PAGAMENTO}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onInputChangeDocumento={handleInputChangeDocumento}
            onInputChangeEmailCliente={handleInputChangeEmailCliente}
            onInputChangeTelefone={handleInputChangeTelefeone}
            onInputChangeEnderecoCep={handleInputChangeEnderecoCep}
            onBlurCEP={handleBlurCEP}
            onBlurCNPJ={handleBlurCNPJ}
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

export default ClientesCadastro;