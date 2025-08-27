import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import {Sidebar} from '../../../components/layout/Sidebar'
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { infosFornecedores } from '../services/fornecedorService';
import { FormatInfos } from '../../../services/FormatInfos';
import { ValidateInfos } from '../../../services/ValidateInfos';
import Popup from "../../../components/layout/CustomPopUp"
import { useNavigate } from 'react-router-dom';
import { FornecedoresForm } from '../components/FornecedoresForm'
import { Header } from '../../../components/layout/Header';
import { Fornecedor, FornecedorForm } from '../types/types';

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

export function FornecedoresCadastro() {
  const [formData, setFormData] = useState(initialFormData);
  const isInitialized = useRef(false);
  const [cnpjError, setCnpjError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
  const { userData, isAuthenticated, logout } = useAuth();  
  const [abaAtiva, setAbaAtiva] = useState<"pessoais" | "endereços">("pessoais");
  
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
        message: 'FORNECEDOR CADASTRADO COM SUCESSO',
        isOpen: true
      });
    } else {
      setPopup({
        type: 'error',
        title: 'Erro',
        message: message || 'Ocorreu um erro ao cadastrar o fornecedor',
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
      idUsuarioCadastro: String(userData?.id_usuario),
      idOtica: String(userData?.id_oticas[0])
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

    if (name === 'ativo') {
      const isActive = value === 'active';
      setFormData(current => ({
        ...current,
        ativo: isActive, 
      }));
      return; 
    }

    let dado: string  = value as string

    if (name == 'enderecoCep'){
      dado = FormatInfos.formatCep(value);
    }

    if (name == 'telefone'){
      dado = FormatInfos.formatTelefone(value);
      validateTelefone(dado)
    }

    if (name == 'email'){
      validateEmail(dado)
    }

    if (name == 'cnpj'){
      dado = FormatInfos.formatCNPJ(value);
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

  const convertFornecedorFormToFornecedor = (form: FornecedorForm): Fornecedor => {
    const idOtica = Number(form.idOtica);
    const idUsuarioCadastro = Number(form.idUsuarioCadastro);
    const prazoPagamento = Number(form.prazoPagamento);

    if (isNaN(idOtica) || isNaN(idUsuarioCadastro) || isNaN(prazoPagamento)) {
      throw new Error("Campos numéricos inválidos na conversão do formulário de fornecedor.");
    }

    return {
      idOtica,
      idUsuarioCadastro,
      razaoSocial: form.razaoSocial,
      nomeFantasia: form.nomeFantasia,
      cnpj: getDIgitosDados(form.cnpj),
      email: form.email,
      telefone: getDIgitosDados(form.telefone),
      enderecoLogradouro: form.enderecoLogradouro,
      enderecoNumero: form.enderecoNumero,
      enderecoComplemento: form.enderecoComplemento,
      enderecoBairro: form.enderecoBairro,
      enderecoCidade: form.enderecoCidade,
      enderecoEstado: form.enderecoEstado,
      enderecoCep: getDIgitosDados(form.enderecoCep),
      ativo: form.ativo,
      observacoes: form.observacoes,
      inscricaoEstadual: form.inscricaoEstadual,
      prazoPagamento
    };
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!validateInfos()){
      return 
    }

    const fornecedorFinal: Fornecedor  = convertFornecedorFormToFornecedor(formData);

    try {
      const response = await fetch(apiUrl + 'fornecedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userData?.token
        },
        body: JSON.stringify(fornecedorFinal),
      });

      const responseData = await response.json()
      const responseMessage = responseData.message || response.statusText || 'Erro ao cadastrar Fornecedor';

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
                Cadastro de Fornecedores
              </h2>
              <p className='text-gray-600'>Preencha as informações do produto abaixo</p>
            </div>
          </div>

          <div className="flex space-x-2 mb-6 ">
            <button
              className={`flex-1 w-full px-4 py-2 rounded ${abaAtiva === "pessoais" ? "bg-blue-600 text-white" : "bg-white"}`}
              onClick={() => setAbaAtiva("pessoais")}
            >
              Dados Pessoais
            </button>
            <button
              className={`flex-1 w-full px-4 py-2 rounded ${abaAtiva === "endereços" ? "bg-blue-600 text-white" : "bg-white"}`}
              onClick={() => setAbaAtiva("endereços")}
            >
              Endereço
            </button>
          </div>

          <FornecedoresForm
            formData={formData}
            cnpjError={cnpjError}
            emailError={emailError}
            telefoneError={telefoneError}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onBlurCEP={handleBlurCEP}
            onBlurCNPJ={handleBlurCNPJ}
            buttonText="Cadastrar"
            abaAtiva={abaAtiva}
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

export default FornecedoresCadastro;