import React, { useState, ChangeEvent  } from 'react';
import { Users } from 'lucide-react';
import type { Cliente } from '../types/types';
import { ClientesBox } from '../components/ClientesBox';
import { SearchBar } from '../components/SearchBarProps';
import {Sidebar} from '../../../components/layout/Sidebar'
import { useAuth } from '../../../contexts/AuthContext'
import { FormatInfos } from '../../../services/FormatInfos';
import { ValidateInfos } from '../../../services/ValidateInfos';
import { infosClientes, infos_metodos_pagamentos } from '../../../services/infosClientes';
import Popup from "../../../components/layout/CustomPopUp"
import { Header } from '../../../components/layout/Header';
import {ClienteEditeDados} from './ClienteEditeDados'
import { useNavigate } from 'react-router-dom';

type PopupType = 'success' | 'error' | 'alert' | null;
interface PopupState {
  type: PopupType;
  title: string;
  message: string;
  isOpen: boolean;
}

const dadosClientes: Cliente[] = [];
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

   const { userData, setCliente, clienteData} = useAuth(); 

   const navigate = useNavigate();


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

   const getClienteSelecionado = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      const clienteDocumento = e.currentTarget.getAttribute("data-id")
      // setClienteSelecionado(true)
      setClientes([])
      setInfoBuscaCliente('')
      
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
            setCliente(clienteEncontrado)
            setFormData(clienteEncontrado)
            setOriginalData(clienteEncontrado)
         }

         navigate('/cliente/editar')
      }
   }

   const handleClickClienteHistorico = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      const clienteDocumento = e.currentTarget.getAttribute("data-id")
      setClientes([])
      setInfoBuscaCliente('')
      
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
         
         setCliente(clienteEncontrado as Cliente)
         navigate('/cliente/historico', {
            state: {data: clienteEncontrado}
         });
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
      if (!data.length){
         handleApiResponse( "alert", "Nenhum cliente encontrado!")
         setClientes([])
         setInfoBuscaCliente('')
         return
      }
      setClientes(data)
   }

   return (
      <div className='flex w-full '>
         <Sidebar/>
         <div className="min-h-screen bg-white-100  flex-1">
            <Header/>
            <div className="bg-white-200 rounded-lg shadow-md p-6 h-full">
               <div className=''>
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
                        {clientes.length} Cliente(s) encontrado(s)
                     </div>
                  </div>
                  <div className='flex items-center gap-5 mb-5'>
                     <select 
                        className=" block w-1/5 p-3 rounded-md border-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm font-medium text-gray-700"
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
                  <ClientesBox clientes={clientes} handleClick={getClienteSelecionado} onClickHistorico={handleClickClienteHistorico}/>
               </div>

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