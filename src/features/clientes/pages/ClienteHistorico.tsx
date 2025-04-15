import { Header } from "../../../components/layout/Header";
import { Sidebar } from "../../../components/layout/Sidebar";
import { useAuth } from "../../../contexts/AuthContext";

export function ClienteHistorico(){
   const { clienteData} = useAuth(); 

   console.log(clienteData) 

   return(
      <div className='flex flex-row w-full'>
         <Sidebar/>
         <div className="min-h-screen bg-white-100  flex-1">
            <Header/>
            <div className="bg-white-200 rounded-lg shadow-md p-6 h-full">
               <p>historico</p> 
            </div>
         </div>
      </div>
   )
}