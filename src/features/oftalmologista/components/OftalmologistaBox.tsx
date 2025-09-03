import {User, Phone, Mail, FileText, PencilIcon} from 'lucide-react';
import type { Oftalmologista, OftalmologistaEditar } from '../types/types';
import { FormatInfos } from '../../../services/FormatInfos';

interface CustomerListProps {
  oftalmologistas:( Oftalmologista |OftalmologistaEditar)[];
  handleClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

export function OftalmologistaBox({ oftalmologistas, handleClick }: CustomerListProps) {

  const getTelefone = (oftalmologista: Oftalmologista) =>{
    return FormatInfos.formatTelefone(oftalmologista.telefone)
  }
  
  return ( 
    <>
      <div className="flex flex-wrap gap-4 w-fit bg-white p-4 rounded-xl min-h-72 h-full">
        {oftalmologistas.map((oftalmologista) => (
          <div
            key={oftalmologista.crm}
            data-id={oftalmologista.crm}
            className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 hover:border-blue-300 hover:shadow-md transition duration-200 cursor-pointer transform hover:scale-[1.01] w-72 "
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{oftalmologista.nomeCompleto}</h3>
                  {/* <p className='font-normal text-gray-500'>{cliente.razaoSocial}</p> */}
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  oftalmologista.status
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-50 text-gray-700'
                }`}
              >
                {oftalmologista.status ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className='flex justify-between'>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className='flex items-center'>
                    <Mail className="h-4 w-4 mr-2" />
                    {oftalmologista.email}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  {oftalmologista.crm}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FileText   className="h-4 w-4 mr-2" />
                  {getTelefone(oftalmologista)}
                </div>
                
              </div>

              <div className="space-y-2 ">
                <div className="relative group">
                  <PencilIcon 
                    size={20} 
                    className="text-gray-700 cursor-pointer"
                    onClick={handleClick} 
                    data-id={oftalmologista.crm}
                  />

                  <div className="absolute right-full mt-2 bottom-1/2 -translate-y-1/2 whitespace-nowrap
                          bg-gray-800 text-white text-xs rounded px-2 py-1 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                          z-[9999] shadow-lg">
                    Editar Dados
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>    
    </>
  );
}

export default OftalmologistaBox