import React, { useState, ChangeEvent  } from 'react';
import { Users } from 'lucide-react';
import type { Oftalmologista } from '../types/types';
import { OftalmologistaBox } from '../components/OftalmologistaBox';
import { SearchBar } from '../components/SearchBarProps';
import {Sidebar} from '../../../components/layout/Sidebar'
import { useAuth } from '../../../contexts/AuthContext'
import { FormatInfos } from '../../../services/FormatInfos';
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

const dadosClientes: Oftalmologista[] = [];

export function Oftalmologista() {
   const [infoBuscaOftalmologista, setInfoBuscaOftalmologista] = useState('');
   const [error, setError] = useState('');
   const [tipoFiltro, setTipoFiltro] = useState('nome');
   const apiUrl = import.meta.env.VITE_API_URL;
   const [clientes, setOftalmologista] = useState<Oftalmologista[]>(dadosClientes);
   const { userData, setOftalmologistaData} = useAuth(); 
   const [currentPage, setCurrentPage] = useState(0)
   const OftalmologistaPerPage = 5
   const [hasNext, setHasNext] = useState(Boolean)
   const [hasPrevious, setHasPrevious] = useState(Boolean)
   const [totalPage, setTotalPage] = useState(0)
   const [containsOftalmologista, setcontainsOftalmologista] = useState(true)
   const [totalOftalmologista, settotalOftalmologista] = useState(0)


   useEffectSkipFirst(() => {
      if(currentPage >= 0 && currentPage < totalPage){
         setcontainsOftalmologista(true)
         getOftalmologista();
      }
   }, [currentPage])

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
      setOftalmologista([])
      setInfoBuscaOftalmologista('')
   }

   const handleInputChangeSearch = (event: ChangeEvent<HTMLInputElement>) =>{
      const  value  = event.target.value;

      setInfoBuscaOftalmologista(value)
      setError('')
   }

   const getOftalmologistaelecionado = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      const OftamologistaCRM = e.currentTarget.getAttribute("data-id")
      setOftalmologista([])
      setInfoBuscaOftalmologista('')
      
      if(OftamologistaCRM){
         setError('')
         const clienteEncontrado = clientes.find((cliente) => {
            if( cliente.crm === OftamologistaCRM) {
               return cliente
            }
         });
   
         if(clienteEncontrado){
            setOftalmologistaData(clienteEncontrado)
         }

         navigate('/oftalmologista/editar')
      }
   }
   
   const getOftalmologista = async () => {
      const idOtica = userData?.id_oticas[0]

      const infoPesquisa = infoBuscaOftalmologista.replace(/[\\/.-]/g, '');


      const response = await fetch(`${apiUrl}Oftalmologista?idOtica=${idOtica}&cnpj=${infoPesquisa}&page=${currentPage}&size=${OftalmologistaPerPage}` , {
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

      settotalOftalmologista(data.totalElements)
      setTotalPage(data.totalPages)
      setHasNext(data.hasNext)
      setHasPrevious(data.hasPrevious)

      const listClientes = data.content;
      if (!listClientes.length){
         handleApiResponse( "alert", "Nenhum cliente encontrado!")
         setOftalmologista([])
         setInfoBuscaOftalmologista('')
         return
      }
      setOftalmologista(listClientes)
   }

   const handleClick = async () => {
      getOftalmologista()
   }

   const previousPage = async () => {
      if (currentPage <= 0) return

      if (currentPage <= totalPage){
         setCurrentPage(prev => prev -1)
      }

      setcontainsOftalmologista(!!hasPrevious)
   }

   const nextPage = async () => {
      if (currentPage < totalPage){
         setCurrentPage(prev => prev +1)
      }

      setcontainsOftalmologista(!!hasNext)
   }

   return (
      <div className='flex w-full'>
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
                        Busca de Oftalmologista
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
                              value={infoBuscaOftalmologista}
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
                  <div className='w-full'>
                     {!containsOftalmologista ?  (
                        <div className='w-full text-center min-h-72 h-full flex justify-center items-center border-gray-300 shadow-sm border rounded-lg'>
                           <h2 className=''>Nenhum registro encontrado</h2>
                        </div>
                     ):(
                        <OftalmologistaBox oftalmologistas={clientes} handleClick={getOftalmologistaelecionado}/>
                     )}
                     {clientes.length > 0 && (
                        <div className='w-full bg-white-300 gap-2 flex justify-between p-1'>
                           <div className=''>
                              <p>Exibindo {OftalmologistaPerPage} de {totalOftalmologista}</p>
                           </div>
                           <div className='flex gap-2'>
                              <div className='cursor-pointer' onClick={previousPage}>
                                 <p>Anterior</p>
                              </div>
                              <div className='flex gap-2'>
                                 {Array.from({ length: totalPage })
                                 .slice(Math.floor(currentPage / 3) * 3, Math.floor(currentPage / 3) * 3 + 3)
                                 .map((_, index) => {
                                    const pageIndex = Math.floor(currentPage / 3) * 3 + index;
                                    return (
                                    <div
                                       key={pageIndex}
                                       className={`w-10 text-center cursor-pointer border border-gray-300 hover:border-blue-300 hover:shadow-md flex justify-center items-center
                                       ${currentPage === pageIndex ? 'bg-blue-200' : 'bg-white'}
                                       `}
                                       onClick={() => setCurrentPage(pageIndex)}
                                    >
                                       <p>{pageIndex + 1}</p>
                                    </div>
                                    );
                                 })}
                              </div>
                              <div className='cursor-pointer' onClick={nextPage}>
                                 <p>Próximo</p>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

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

export default Oftalmologista