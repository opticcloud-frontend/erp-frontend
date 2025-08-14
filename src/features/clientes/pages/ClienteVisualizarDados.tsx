import { ArrowLeft, Users, Mail, Phone, ClipboardList, Calendar, MapPin } from "lucide-react";
import { Header } from "../../../components/layout/Header";
import { Sidebar } from "../../../components/layout/Sidebar";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Cliente } from '../types/types';
import { useState } from "react";

export function ClienteVisualizarDados(){
   const { userData, setClienteData, clienteData} = useAuth();  
   const [abaAtiva, setAbaAtiva] = useState<'compras' | 'consultas' | 'receitas'>('compras');

   const navigate = useNavigate();
   
   const handleClickBack = () =>{
      navigate("/clientes");
      setClienteData(undefined)
   }
 
   return(
      <div className='flex flex-row w-full '> 
         <Sidebar/> 
         <div className="min-h-screen bg-white-100  flex-1">
            <Header/>
            <div className="bg-white-200 rounded-lg shadow-md p-6 h-full ">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                     <ArrowLeft className='cursor-pointer' onClick={handleClickBack}/>
                     <div className="bg-blue-600 p-2 rounded-lg">
                     <Users className="h-6 w-6 text-white" />
                     </div>
                     <h1 className="text-2xl font-semibold text-gray-800">
                     {clienteData?.nomeCompleto}
                     </h1>
                  </div>
                  
               </div>
               <div className="shadow-sm border max-w-96 w-auto h-auto p-5 gap-3 flex flex-col">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-5">Informações Pessoais</h2>
                  <div className="flex justify-between">
                     <div>
                        <div className="flex gap-2 items-center">
                           <Mail size={16}/>
                           <p>Email</p>
                        </div>
                        <p className="text-sm text-gray-500 ml-6">{clienteData?.email}</p>
                     </div>
                     <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium self-center ${
                           clienteData?.ativo
                           ? 'bg-green-50 text-green-700'
                           : 'bg-gray-50 text-gray-700'
                        }`}
                     >  
                     {clienteData?.ativo ? 'Ativo' : 'Inativo'}
                     </span>
                  </div>

                  <div>
                     <div className="flex gap-2 items-center">
                        <Phone size={16}/>
                        <p>Telefone</p>
                     </div>
                     <p className="text-sm text-gray-500 ml-6">{clienteData?.telefone}</p>
                  </div>

                  <div>
                     <div className="flex gap-2 items-center">
                        <Calendar size={16}/>
                        <p>Data de Nascimento</p>
                     </div>
                     <p className="text-sm text-gray-500 ml-6">{clienteData?.dataNascimento}</p>
                  </div>

                  <div>
                     <div className="flex gap-2 items-center">
                        <ClipboardList size={16}/>
                        {clienteData?.descricaoTipoCliente == "PESSOA_FISICA" ? (

                           <p>CPF</p>
                        ): (
                           <p>CNPJ</p>
                        )}
                     </div>
                     <p className="text-sm text-gray-500 ml-6">{clienteData?.documento}</p>
                  </div>

                  <div>
                     <div className="flex gap-2 items-center">
                        <MapPin size={16}/>
                        <p>Endereço</p>
                     </div>
                     <p className="text-sm text-gray-500 ml-6">{clienteData?.enderecoCidade} - {clienteData?.enderecoEstado}</p>
                  </div>
               </div>

               <div className='flex items-center gap-5 my-5 text-center bg-gray-200 p-1 rounded-lg'>
                  <p 
                     className={`${abaAtiva === 'compras' ? "bg-gray-100" : "bg-gray-200"} text-sm font-medium text-gray-700 p-2 w-3/6 cursor-pointer rounded-lg transition duration-300`}
                     onClick={() => setAbaAtiva('compras')}
                  >
                     Compras
                  </p>
                  <p 
                     className={`${abaAtiva === 'consultas' ? "bg-gray-100" : "bg-gray-200"} text-sm font-medium text-gray-700 p-2 w-3/6 cursor-pointer rounded-lg transition duration-300`}
                     onClick={() => setAbaAtiva('consultas')}
                  >
                     Consultas
                  </p>
                  <p 
                     className={`${abaAtiva === 'receitas' ? "bg-gray-100" : "bg-gray-200"} text-sm font-medium text-gray-700 p-2 w-3/6 cursor-pointer rounded-lg transition duration-300`}
                     onClick={() => setAbaAtiva('receitas')}
                  >
                     Receitas
                  </p>
               </div>
               
            </div>
         </div>
      </div>
   )
}