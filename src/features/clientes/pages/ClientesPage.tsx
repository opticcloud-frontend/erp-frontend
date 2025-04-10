import React, { useState, ChangeEvent  } from 'react';
import { Users, ArrowLeft } from 'lucide-react';
import type { Cliente } from '../types/types';
import { ClientesBox } from '../components/ClientesBox';
import { SearchBar } from '../components/SearchBarProps';
import {Sidebar} from '../../../components/layout/Sidebar'
import { useAuth } from '../../../contexts/AuthContext'
import { ClientForm } from '../components/ClienteForm'
import { FormatInfos } from '../../../services/FormatInfos';
import { ValidateInfos } from '../../../services/ValidateInfos';
import { infosClientes, infos_metodos_pagamentos } from '../../../services/infosClientes';
import Popup from "../../../components/layout/CustomPopUp"
import { p } from 'framer-motion/client';

type PopupType = 'success' | 'error' | 'alert' | null;
interface PopupState {
  type: PopupType;
  title: string;
  message: string;
  isOpen: boolean;
}

const dadosClientes: Cliente[] = [];
const METODOS_PAGAMENTO = infos_metodos_pagamentos;
const initialFormData = infosClientes


export function ClientesPage() {
   const [infoBuscaCliente, setInfoBuscaCliente] = useState('');
   const [error, setError] = useState('');

   const [displayDocumento, setDisplayDocumento] = useState(''); 
   const [tipoFiltro, setTipoFiltro] = useState('nome');
   const apiUrl = import.meta.env.VITE_API_URL;
   const [clientes, setClientes] = useState<Cliente[]>(dadosClientes);
   const [formData, setFormData] = useState<Cliente>({} as Cliente);
   const [originalData, setOriginalData] = useState<Cliente>({} as Cliente);

   const { userData} = useAuth(); 
   const [documentoError, setDocumentoError] = useState('');
   const [emailError, setEmailError] = useState('');
   const [telefoneError, setTelefoneError] = useState('');
   const [clienteSelecionado, setClienteSelecionado] = useState(false);
   const [infosAdicionais, setInfosAdicionais] = useState(false);

   const [popup, setPopup] = useState<PopupState>({
      type: null,
      title: '',
      message: '',
      isOpen: false
   });

   const handleApiResponse = (typePopPup: string = "", message: string) => {
      if(typePopPup == "alert"){
         setPopup({
            type: 'alert',
            title: 'Alerta',
            message: message,
            isOpen: true
         });
      }


      if (typePopPup == "sucess") {
         setPopup({
            type: 'success',
            title: 'Sucesso',
            message: message,
            isOpen: true
         });
      }

      if (typePopPup == "error") {
         setPopup({
            type: typePopPup,
            title: 'Erro',
            message: message || 'Ocorreu um erro ao editar os dados do cliente',
            isOpen: true
         });
       }
   };

   const closePopup = () => {
      setPopup(prev => ({ ...prev, isOpen: false }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const updatedFields = getUpdatedFields()
      if (Object.keys(updatedFields).length === 0) {
         handleApiResponse( "alert", "NÃO HÁ DADOS PARA ATUALIZAR")
         return;
      }

      updateCliente(updatedFields)
      
   }
    
   const handleBlurCNPJ = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const cnpj = event.target.value.replace(/\D/g, ''); 

      if(!cnpj) return

      try {
         const data = await fetchCNPJData(cnpj);

         if(data){
            data.enderecoCep = FormatInfos.formatCep(data.enderecoCep);
            data.telefone = FormatInfos.formatTelefone(data.telefone);
   
            setFormData(prev => ({
               ...prev,
               ...data
            }));
         }
      } catch (error) {
         console.error('Erro ao buscar dados do CNPJ', error)
      }

   };

   const setInputDocumento = async (value: string) =>{
      const documentoDigitos = value.replace(/\D/g, '');
      let formattedDoc = '';


      if (formData.descricaoTipoCliente === 'PESSOA_FISICA') {
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

      setFormData(current => {
         if (current) {
           return {
             ...current,
             documento: documentoDigitos,
           };
         }
         return current; 
      });
      return true
   }

   const handleInputChangeDocumento = async (
      e: ChangeEvent<HTMLInputElement>
   ) => {
      const {value} = e.target;
      const resp = await setInputDocumento(value)
      if(resp){
         return
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

   const handleInputChange = async (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;

      if (name === 'enderecoCep') {
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

   const fetchCNPJData = async (cnpj: string) => {
      try {
         const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
         if (!response.ok) {
            throw new Error('CNPJ não encontrado');
         }
         const data = await response.json();
        
         return {
            razaoSocial: data.razao_social || formData.razaoSocial,
            email: data.email || formData.email,
            enderecoLogradouro: data.logradouro || formData.enderecoLogradouro,
            enderecoNumero: data.numero || formData.enderecoNumero,
            enderecoCidade: data.municipio || formData.enderecoCidade,
            enderecoBairro: data.bairro || formData.enderecoBairro,
            nomeFantasia: data.nome_fantasia || formData.nomeFantasia,
            enderecoComplemento: data.complemento || formData.enderecoComplemento,
            enderecoCep: data.cep || formData.enderecoCep,
            telefone: data.ddd_telefone_1 || formData.telefone,
         };
      } catch (error) {
        console.error('Erro ao buscar dados do CNPJ ', error);
      }
   };
   
   
   const handleBlurCEP = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const cep = event.target.value.replace(/\D/g, ''); 

      if(!cep) return
      
      try {
         const data = await fetchCEPData(cep);
   
         if (data) {
            data.enderecoCep = FormatInfos.formatCep(data.enderecoCep);
         
            setFormData(prev => ({
               ...prev,
               ...data
            }));
         }
      } catch (error) {
         console.error('Erro ao buscar dados do CEP', error);
      }

   };

   const fetchCEPData = async (cep: string) => {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      if (!response.ok) { 
         throw new Error('CEP não encontrado');
      }

      const data = await response.json();      
      
      return {
         enderecoBairro: data.neighborhood || formData.enderecoBairro,
         enderecoCidade: data.city || formData.enderecoCidade,
         enderecoCep: data.cep || formData.enderecoCep, 
      }; 
   };
   
   const handleInputChangeSelect = async (event:  ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;

      setTipoFiltro(value);
      setClientes([])
      setInfoBuscaCliente('')
      setFormData(initialFormData)
   }

   const handleInputChangeSearch = (event: ChangeEvent<HTMLInputElement>) =>{
      const  value  = event.target.value;

      setInfoBuscaCliente(value)
      setError('')
   }

   const getClienteSelecionado = (e: React.MouseEvent<HTMLDivElement>) => {
      const clienteDocumento = e.currentTarget.getAttribute("data-id")
      setClienteSelecionado(true)
      
      if(clienteDocumento){
         setError('')
         const clienteEncontrado = clientes.find((cliente) => {
            if( cliente.documento === clienteDocumento) {
               return cliente
            }
         });
         
         const documentoDigitos = clienteEncontrado?.documento.replace(/\D/g, '');

         if (clienteEncontrado?.descricaoTipoCliente === 'PESSOA_FISICA' && documentoDigitos != undefined) {
            const formattedDoc: string = FormatInfos.formatCPF(documentoDigitos);
            setDisplayDocumento(formattedDoc);
         }

         if (clienteEncontrado?.descricaoTipoCliente === 'PESSOA_JURIDICA' && documentoDigitos != undefined) {
            const formattedDoc: string = FormatInfos.formatCNPJ(documentoDigitos);
            setDisplayDocumento(formattedDoc);
         }
         
   
         if(clienteEncontrado){
            setFormData(clienteEncontrado)
            setOriginalData(clienteEncontrado)
         }
      }

   }

   const getUpdatedFields = (): Partial<Cliente> => {
      const updatedFields: Partial<Cliente> = {};
      for (const key in formData) {
         const newValue = formData[key as keyof Cliente];
         const originalValue = originalData[key as keyof Cliente];

   
         if (newValue !== originalValue) {
            updatedFields[key as keyof Cliente] = newValue as any;
            setOriginalData(current => ({
               ...current,
               [key]: newValue,
            }));
         }
      }
      return updatedFields;
   };


   const updateCliente = async (updatedFields: Partial<Cliente> ) => {
      const idOtica = userData?.id_oticas[0]

      const response = await fetch(`${apiUrl}clientes/idOtica=${idOtica}?documento=${formData.documento}` , {
         method: 'PATCH',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': 'Bearer ' + userData?.token
         },
         body: JSON.stringify(updatedFields),
      });

      handleApiResponse('sucess', "Usuario editado com sucesso")
      if (!response.ok) {
        throw new Error('Erro ao atualizar informações do cliente');
      }
   }

   const handleClick = async () => {
      const idOtica = userData?.id_oticas[0]
      setFormData(initialFormData)

      const infoPesquisa = infoBuscaCliente.replace(/[\\/.-]/g, '');
      if (infoPesquisa.trim() == ""){
         setError('Campo vazio, digite para pesquisar ')
         return 
      }
      const filtroPesquisa = tipoFiltro == "CPF/CNPJ" ? "documento": tipoFiltro


      const response = await fetch(`${apiUrl}clientes?idOtica=${idOtica}&${filtroPesquisa}=${infoPesquisa}` , {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': 'Bearer ' + userData?.token
         },
      });
      if (!response.ok) {
        throw new Error('CNPJ não encontrado');
      }
      const data = await response.json();
      setClientes(data)
   }

   const handleClickBack = () =>{
      setClienteSelecionado(false)
   }

   const handleClickInfosAdicionais = () =>{
      setInfosAdicionais(true)
   }

   const handleClickInfosGerais = () =>{
      setInfosAdicionais(false)
   }

   return (
      <div className='flex w-full'>
         <Sidebar/>
         <div className="min-h-screen bg-gray-100 p-4 flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
               

               {clienteSelecionado ? (
                  <>
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                           <ArrowLeft className='cursor-pointer' onClick={handleClickBack}/>
                           <div className="bg-blue-600 p-2 rounded-lg">
                           <Users className="h-6 w-6 text-white" />
                           </div>
                           <h1 className="text-2xl font-semibold text-gray-800">
                           Editar Cliente
                           </h1>
                        </div>
                        <div className="text-sm text-gray-500">
                           {clientes.length} clientes encontrados
                        </div>
                     </div>
                     <div className='flex items-center gap-5 mb-5 text-center'>
                        <p 
                           className={`${infosAdicionais ? "bg-gray-100": "bg-gray-200"} p-2 w-3/6 cursor-pointer`}
                           onClick={handleClickInfosGerais}
                        >
                           Informações gerais
                        </p>
                        <p 
                           className={`${infosAdicionais ? "bg-gray-200": "bg-gray-100"} p-2 w-3/6 cursor-pointer`} 
                           onClick={handleClickInfosAdicionais}>
                           Informações adicionais
                        </p>
                     </div>
  
                     <ClientForm
                        formData={formData}
                        METODOS_PAGAMENTO={METODOS_PAGAMENTO}
                        buttonText="Salvar"
                        displayDocumento={displayDocumento}
                        onBlurCEP={handleBlurCEP}
                        onBlurCNPJ={handleBlurCNPJ}
                        onInputChange={handleInputChange}
                        onInputChangeDocumento={handleInputChangeDocumento}
                        onInputChangeEmailCliente={handleInputChangeEmailCliente}
                        onInputChangeTelefone={handleInputChangeTelefeone}
                        onInputChangeEnderecoCep={handleInputChangeEnderecoCep}
                        documentoError={documentoError}
                        emailError={emailError}
                        telefoneError={telefoneError}
                        onSubmit={handleSubmit}
                        disabled={true}
                        infosAdicionais={infosAdicionais}
                     />
                     
                  </>
               ): (
                  <>
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                           <div className="bg-blue-600 p-2 rounded-lg">
                           <Users className="h-6 w-6 text-white" />
                           </div>
                           <h1 className="text-2xl font-semibold text-gray-800">
                           Busca de Clientes
                           </h1>
                        </div>
                        <div className="text-sm text-gray-500">
                           {clientes.length} clientes encontrados
                        </div>
                     </div>
                     <div className='flex items-center gap-5 mb-5'>
                        <select 
                           className=" block w-1/5 p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           id="selectFilter"
                           name="selectFilter"
                           value={tipoFiltro} 
                           onChange={(e) => handleInputChangeSelect(e)}
                        >
                           <option value="nome">Nome</option>
                           <option value="CPF/CNPJ">CPF / CNPJ</option>
                           <option value="email">Email</option>
                        </select>
                        <div className="w-2/5">
                              <SearchBar
                                 value={infoBuscaCliente}
                                 onChange={(e) => handleInputChangeSearch(e)}
                                 type= {tipoFiltro}
                                 error={error}
                              />
                           
                        </div>
                        <button 
                           className='bg-blue-600 text-white p-2 w-28 rounded-md'
                           onClick={handleClick}
                        >
                           Buscar
                        </button>
                     </div>
                     <ClientesBox clientes={clientes} handleClick={getClienteSelecionado}/>
                  </>
               )}

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
   )
}

export default ClientesPage