import React, { useState } from 'react';
import { Users } from 'lucide-react';
import type { Cliente } from './types';
import { ClientesBox } from './ClientesBox';
import { SearchBar } from './SearchBarProps';
import {Sidebar} from '../../layout/Sidebar'
import { useAuth } from '../../contexts/AuthContext'
import { ClientForm } from '../../layout/Form'



import { infosClientes, infos_metodos_pagamentos } from '../../utils/infosClientes';

const dadosClientes: Cliente[] = [];
const METODOS_PAGAMENTO = infos_metodos_pagamentos;
const initialFormData = infosClientes

export function ClientesPage() {
   const [searchTerm, setSearchTerm] = useState('');
   const [formData, setFormData] = useState(initialFormData);

   const [tipoFiltro, setTipoFiltro] = useState('nome');
   const apiUrl = import.meta.env.VITE_API_URL;
   const [clientes, setClientes] = useState<Cliente[]>(dadosClientes);
   const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>(undefined);
   const { userData} = useAuth();  
   const [displayDocumento, setDisplayDocumento] = useState(''); 
   

   const handleInputChange = async (event: InputEvent) => {
      const { name, value } = event.target as HTMLInputElement;

      const filtroPesquisa = value == "CPF/CNPJ" ? "documento": value

      if (name === 'selectFilter') {
         setTipoFiltro(filtroPesquisa);
      } 
   }

   const handleInputChange2 = async (event: FormInputEvent) => {

   }

   const getClienteSelecionado = (e: React.MouseEvent<HTMLDivElement>) => {
      const clienteId = e.currentTarget.getAttribute("data-id")

      if(clienteId){
         const clienteEncontrado = clientes.find((cliente) => {
            if( cliente.id.toString() === clienteId) {
               return cliente
            }
         });
   
         if(clienteEncontrado){
            setClienteSelecionado(clienteEncontrado)
         }
      }

   }

   const handleClick = async () => {
      const idOtica = userData?.id_oticas[0]

      setClienteSelecionado(undefined)

      const infoPesquisa = searchTerm.replace(/\D/g, '');

      const response = await fetch(`${apiUrl}clientes?idOtica=${idOtica}&${tipoFiltro}=${infoPesquisa}` , {
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
                     onChange={(e) => handleInputChange(e)}
                  >
                     <option value="nome">Nome</option>
                     <option value="CPF/CNPJ">CPF / CNPJ</option>
                     <option value="email">Email</option>
                  </select>
                  <div className="w-2/5">
                     <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
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
               {clienteSelecionado ? (
                  <ClientForm
                     formData={clienteSelecionado}
                     displayDocumento={displayDocumento}
                     METODOS_PAGAMENTO={METODOS_PAGAMENTO}
                     onInputChange={handleInputChange2}
                     buttonText="Cadastrar"
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