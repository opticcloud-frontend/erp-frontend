import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../../layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { infosClientes, infos_metodos_pagamentos } from '../../utils/infosClientes';
import { FormatInfos } from '../../utils/FormatInfos';
import { ValidateInfos } from '../../utils/ValidateInfos';
import Popup from "../../layout/CustomPopUp";
import { useNavigate } from 'react-router-dom';

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
      console.log('Erro ao buscar dados do CNPJ ', error);
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
      console.log('Erro ao buscar dados do CEP ', error);
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
      oticaId: String(userData?.id_oticas[0]), 
    });
    isInitialized.current = true;
  }, []);  
   
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }
 
  const setInputDocumento = async (value: string) =>{
    const documentoDigitos = value.replace(/\D/g, '');
    let formattedDoc = '';

    if (formData.tipoCliente === 'PESSOA_FISICA') {
      formattedDoc = FormatInfos.formatCPF(value);
      setDisplayDocumento(formattedDoc);

      if (!value) {
        setDocumentoError('');
        return false;
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
    return true
  }

  const setInputtipoCliente = (value: string) => {
    setFormData({
      ...initialFormData,
      tipoCliente: value as string,
    });
    setDisplayDocumento('');
  }
  

  const handleInputChange = async (event: FormInputEvent) => {
    const { name, value } = event.target;

    if (name === 'documento') {
      const resp = await setInputDocumento(value)
      if(resp){
        return
      }
    } else if (name === 'tipoCliente') {
      setInputtipoCliente(value)
    } else if (name === 'emailCliente') {
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
    } else if (name === 'telefone') {
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
    } else if (name === 'enderecoCep') {
      const formattedCEP = FormatInfos.formatCep(value);
      setFormData(current => ({
        ...current,
        [name]: formattedCEP,
      }));
    } else {
      setFormData(current => ({
        ...current,
        [name]: value,
      }));
    }
  };

  const validateInfos = () =>{
    // if (formData.tipoCliente === 'PESSOA_FISICA' && !ValidateInfos.validateCPF(formData.documento)) {
    //   setDocumentoError('CPF inválido');
    //   return false;
    // }
    
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
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="tipoCliente"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Cliente *
                </label>
                <select
                  id="tipoCliente"
                  name="tipoCliente"
                  value={formData.tipoCliente}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="PESSOA_FISICA">Pessoa Física</option>
                  <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Situação *
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  id="ativo"
                  name="ativo"
                  value={formData.ativo ? 'active' : 'inactive'}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: 'ativo',
                        value: e.target.value === 'active',
                      },
                    } as { target: { name: 'ativo'; value: boolean } })
                  }
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              {formData.tipoCliente === 'PESSOA_FISICA' ? (
                <>
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      id="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="documento"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      CPF *
                    </label>
                    <input
                      type="text"
                      name="documento"
                      id="documento"
                      value={displayDocumento}
                      onChange={handleInputChange}
                      maxLength={14}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        documentoError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {documentoError && (
                      <p className="mt-1 text-sm text-red-600">{documentoError}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="razaoSocial"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Razão Social *
                    </label>
                    <input
                      type="text"
                      name="razaoSocial"
                      id="razaoSocial"
                      value={formData.razaoSocial}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="documento"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      CNPJ *
                    </label>
                    <input
                      type="text"
                      name="documento"
                      id="documento"
                      value={displayDocumento}
                      onBlur={handleBlurCNPJ}
                      onChange={handleInputChange}
                      maxLength={18}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="nomeFantasia"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nome Fantasia
                    </label>
                    <input
                      type="text"
                      name="nomeFantasia"
                      id="nomeFantasia"
                      value={formData.nomeFantasia}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="responsavelLegal"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Responsável Legal
                    </label>
                    <input
                      type="text"
                      name="responsavelLegal"
                      id="responsavelLegal"
                      value={formData.responsavelLegal}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="razaoSocial"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Inscrição Estadual 
                    </label>
                    <input
                      type="text"
                      name="inscricaoEstadual"
                      id="inscricaoEstadual"
                      value={formData.inscricaoEstadual}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {formData.tipoCliente === 'PESSOA_FISICA' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="emailCliente"
                  value={formData.emailCliente}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  maxLength={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                {telefoneError && (
                  <p className="mt-1 text-sm text-red-600">{telefoneError}</p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logradouro *
                  </label>
                  <input
                    type="text"
                    name="enderecoLogradouro"
                    value={formData.enderecoLogradouro}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP *
                  </label>
                  <input
                    type="text"
                    name="enderecoCep"
                    value={formData.enderecoCep}
                    onChange={handleInputChange}
                    onBlur={handleBlurCEP}
                    maxLength={9} // XXXXX-XXX tem 9 caracteres
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    name="enderecoNumero"
                    value={formData.enderecoNumero}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="enderecoComplemento"
                    value={formData.enderecoComplemento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    name="enderecoBairro"
                    value={formData.enderecoBairro}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="enderecoCidade"
                    value={formData.enderecoCidade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <input
                    type="text"
                    name="enderecoEstado"
                    value={formData.enderecoEstado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Método de Pagamento Preferido *
                </label>
                <select
                  name="metodoPagamentoPreferido"
                  value={formData.metodoPagamentoPreferido}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {METODOS_PAGAMENTO.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Limite de Crédito
                </label>
                <input
                  type="text"
                  name="limiteCredito"
                  value={formData.limiteCredito}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
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
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cadastrar
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default ClientesCadastro;