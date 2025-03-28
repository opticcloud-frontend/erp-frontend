import React, { useState, ChangeEvent } from 'react';
import { Users } from 'lucide-react';
import type { Cliente } from './types';
import { ClientesBox } from './ClientesBox';
import { SearchBar } from './SearchBarProps';
import {Sidebar} from '../../layout/Sidebar'
import { useAuth } from '../../contexts/AuthContext'
import { ClientForm } from '../../layout/Form'
import { FormatInfos } from '../../utils/FormatInfos';
import { ValidateInfos } from '../../utils/ValidateInfos';



import { infosClientes, infos_metodos_pagamentos } from '../../utils/infosClientes';

const dadosClientes: Cliente[] = [];
const METODOS_PAGAMENTO = infos_metodos_pagamentos;
const initialFormData = infosClientes


export function ClientesPage() {
   const [infoBuscaCliente, setInfoBuscaCliente] = useState('');

   const [displayDocumento, setDisplayDocumento] = useState(''); 
   const [tipoFiltro, setTipoFiltro] = useState('nome');
   const apiUrl = import.meta.env.VITE_API_URL;
   const [clientes, setClientes] = useState<Cliente[]>(dadosClientes);
   const [formData, setFormData] = useState<Cliente>({} as Cliente);
   const [click, setClick] = useState(false)
   const { userData} = useAuth(); 
   const [documentoError, setDocumentoError] = useState('');
   const [emailError, setEmailError] = useState('');
   const [telefoneError, setTelefoneError] = useState('');

   

   const handleBlurCNPJ = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

   const setInputipoCliente = (value: string) => {
      setFormData({
        ...initialFormData,
        tipoCliente: value as string,
      });
      setDisplayDocumento('');
   }

   const handleInputChange = async (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = event.target;

      if (name === 'documento') {
         const resp = await setInputDocumento(value)
         if(resp){
            return
         }
      } else if (name === 'tipoCliente') {
         setInputipoCliente(value)
      } else if (name === 'emailCliente') {
         setFormData(current => ({
         ...current!,
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
   
   
   const handleBlurCEP = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
   
   const handleInputChangeSelect = async (event:  ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;

      setClick(false)
      setTipoFiltro(value);
      setClientes([])
      setInfoBuscaCliente('')
   }

   const getClienteSelecionado = (e: React.MouseEvent<HTMLDivElement>) => {
      const clienteId = e.currentTarget.getAttribute("data-id")
      
      if(clienteId){
         const clienteEncontrado = clientes.find((cliente) => {
            if( cliente.documento === clienteId) {
               return cliente
            }
         });
         
         const documentoDigitos = clienteEncontrado?.documento.replace(/\D/g, '');

         if (clienteEncontrado?.tipoCliente === 'PESSOA_FISICA' && documentoDigitos != undefined) {
            const formattedDoc: string = FormatInfos.formatCPF(documentoDigitos);
            setDisplayDocumento(formattedDoc);
         }

         if (clienteEncontrado?.tipoCliente === 'PESSOA_JURIDICA' && documentoDigitos != undefined) {
            const formattedDoc: string = FormatInfos.formatCNPJ(documentoDigitos);
            setDisplayDocumento(formattedDoc);
         }
         
   
         if(clienteEncontrado){
            setFormData(clienteEncontrado)
            setClick(true)
         }
      }

   }

   const handleClick = async () => {
      const idOtica = userData?.id_oticas[0]
      setClick(false)

      const infoPesquisa = infoBuscaCliente.replace(/[\\/.-]/g, '');
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

   return (
      <div className='flex w-full'>
          <Sidebar/>
         <div className="min-h-screen bg-gray-100 p-4 flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
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
                        onChange={setInfoBuscaCliente}
                        type= {tipoFiltro}
                     />
                  </div>
                  <button 
                     className='bg-blue-600 text-white p-2 w-28 rounded-md'
                     onClick={handleClick}
                  >
                     Buscar
                  </button>
               </div>
               {click ? (
                  <ClientForm
                     formData={formData}
                     METODOS_PAGAMENTO={METODOS_PAGAMENTO}
                     buttonText="Salvar"
                     displayDocumento={displayDocumento}
                     onBlurCEP={handleBlurCEP}
                     onBlurCNPJ={handleBlurCNPJ}
                     onInputChange={handleInputChange}
                     documentoError={documentoError}
                     emailError={emailError}
                     telefoneError={telefoneError}
                     />
               ): (

                  <ClientesBox clientes={clientes} handleClick={getClienteSelecionado}/>
               )}
            </div>
         </div>
      </div>
   )
}

export default ClientesPage