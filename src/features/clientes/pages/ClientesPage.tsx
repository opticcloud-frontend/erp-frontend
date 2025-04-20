import React, { useState, ChangeEvent, useEffect, useRef  } from 'react';
import { Users } from 'lucide-react';
import type { Cliente } from '../types/types';
import { ClientesBox } from '../components/ClientesBox';
import { SearchBar } from '../components/SearchBarProps';
import {Sidebar} from '../../../components/layout/Sidebar'
import { useAuth } from '../../../contexts/AuthContext'
import { FormatInfos } from '../../../services/FormatInfos';
import { ValidateInfos } from '../../../services/ValidateInfos';
import { infosClientes } from '../../../services/infosClientes';
import Popup from "../../../components/layout/CustomPopUp"
import { Header } from '../../../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import { useEffectSkipFirst } from '../../../components/ui/useEffectSkipFirst';

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
   const [tipoFiltro, setTipoFiltro] = useState('nome');
   const apiUrl = import.meta.env.VITE_API_URL;
   const [clientes, setClientes] = useState<Cliente[]>(dadosClientes);
   const [formData, setFormData] = useState<Cliente>({} as Cliente);
   const [originalData, setOriginalData] = useState<Cliente>({} as Cliente);
   const { userData, setClienteData, clienteData} = useAuth(); 
   const [currentPage, setCurrentPage] = useState(0)
   const [clientePerPage, setClientePerPage] = useState(5)
   const [hasNext, setHasNext] = useState()
   const [hasPrevious, setHasPrevious] = useState()
   const [totalPage, setTotalPage] = useState(0)
   const [containsClient, setContainsClient] = useState(true)


   useEffectSkipFirst(() => {
      getClientes();
   }, [currentPage])


   // useEffect(() =>{
   //    console.log(isFirstRender.current)
   //    if (isFirstRender.current) {
   //       isFirstRender.current = false;
   //       return;
   //    }


   //    void getClientes();
   // }, [currentPage])

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
            clienteEncontrado.documento = formattedDoc
         }

         if (clienteEncontrado?.descricaoTipoCliente === 'PESSOA_JURIDICA' && documentoDigitos != undefined) {
            const formattedDoc: string = FormatInfos.formatCNPJ(documentoDigitos);
            clienteEncontrado.documento = formattedDoc
         }
   
         if(clienteEncontrado){
            setClienteData(clienteEncontrado)
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
         // TODO
         if (clienteEncontrado?.descricaoTipoCliente === 'PESSOA_FISICA' && documentoDigitos != undefined) {
            const formattedDoc: string = FormatInfos.formatCPF(documentoDigitos);
            clienteEncontrado.documento = formattedDoc
         }

         if (clienteEncontrado?.descricaoTipoCliente === 'PESSOA_JURIDICA' && documentoDigitos != undefined) {
            const formattedDoc: string = FormatInfos.formatCNPJ(documentoDigitos);
            clienteEncontrado.documento = formattedDoc
         }
         
   
         if(clienteEncontrado){
            setFormData(clienteEncontrado)
            setOriginalData(clienteEncontrado)
         }
         
         setClienteData(clienteEncontrado as Cliente)
         navigate('/cliente/historico');
      }

   }

   const getClientes = async () => {
      const idOtica = userData?.id_oticas[0]
      setFormData(initialFormData)

      const infoPesquisa = infoBuscaCliente.replace(/[\\/.-]/g, '');
      const filtroPesquisa = tipoFiltro == "CPF/CNPJ" ? "documento": tipoFiltro

      console.log(`${apiUrl}clientes?idOtica=${idOtica}&${filtroPesquisa}=${infoPesquisa}&page=${currentPage}&size=${clientePerPage}`)

      const response = await fetch(`${apiUrl}clientes?idOtica=${idOtica}&${filtroPesquisa}=${infoPesquisa}&page=${currentPage}&size=${clientePerPage}` , {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': 'Bearer ' + userData?.token
         },
      });

      if (!response.ok) {
        throw new Error('Cliente não encontrado');
      }

      
      const data = await response.json();
      setTotalPage(data.totalPages)
      
      setHasNext(data.hasNext)
      setHasPrevious(data.hasPrevious)
      const listClientes = data.content;
      if (!listClientes.length){
         handleApiResponse( "alert", "Nenhum cliente encontrado!")
         setClientes([])
         setInfoBuscaCliente('')
         return
      }
      setClientes(listClientes)
   }

   const handleClick = async () => {
      getClientes()
   }

   const previousPage = async () => {
      if (hasPrevious){
         setContainsClient(true)
         console.log(currentPage)
         setCurrentPage(currentPage-1)
      }else{
         setContainsClient(false)
      }
   }

   const nextPage = async () => {
      if (hasNext) {
         setContainsClient(true)
         setCurrentPage(currentPage+1)
      } else{
         setContainsClient(false)
      }
   }

   const handleClickPage = (index) => {
      setCurrentPage(index+1)
   }

   return (
      <div className='flex w-full '>
         <Sidebar/>
         <div className="min-h-screen bg-white-100   flex-1">
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
                  <ClientesBox containsClient={containsClient} clientes={clientes} handleClick={getClienteSelecionado} onClickHistorico={handleClickClienteHistorico}/>

                  {clientes.length > 0 && (
                     <div className='w-full bg-white-300 gap-2 flex justify-between p-1'>
                     <div className=''>
                        <p>Exibindo 5 de {clientes.length}</p>
                     </div>
                     <div className='flex gap-2'>
                        <div className='cursor-pointer' onClick={previousPage}>
                           <p>Anterior</p>
                        </div>
                        {Array.from({ length: totalPage }).map((_, index) => (
                           <div key={index} 
                              className={`bg-white-300 w-10 text-center cursor-pointer border border-gray-300 hover:border-blue-300 hover:shadow-md
                              ${currentPage == index ? 'bg-blue-300' : ''}   
                              `}
                              onClick={() =>  setCurrentPage(index)}
                           >
                              <p>{index + 1}</p>
                           </div>
                        ))}
                        <div className='cursor-pointer' onClick={nextPage}>
                           <p>Próximo</p>
                        </div>
                     </div>
                     </div>
                  )}
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