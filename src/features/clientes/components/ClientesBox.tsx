import { User, Phone, Mail, MapPin, FileText, PencilIcon, ClipboardList    } from 'lucide-react';
import type { Cliente } from '../types/types';
import { FormatInfos } from '../../../services/FormatInfos';

interface CustomerListProps {
  clientes: Cliente[];
  handleClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  onClickHistorico: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

export function ClientesBox({ clientes, handleClick, onClickHistorico }: CustomerListProps) {
  const getDocumento = (cliente: Cliente) =>{
    const tipoPessoa = cliente.descricaoTipoCliente 
    const documento = cliente.documento 

    return tipoPessoa == "PESSOA_FISICA" ? FormatInfos.formatCPF(documento) : FormatInfos.formatCNPJ(documento)
  }

  const getNome = (cliente: Cliente) =>{
    const tipoPessoa = cliente.descricaoTipoCliente 
    return tipoPessoa == "PESSOA_FISICA" ? cliente.nomeCompleto : cliente.nomeFantasia
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl p-4 rounded-xl">
      {clientes.map((cliente) => (
        <div
          key={cliente.documento}
          data-id={cliente.documento}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:border-blue-300 hover:shadow-md transition-shadow cursor-pointer transform transition-transform duration-100 relative z-0"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{getNome(cliente)}</h3>
                <p className='font-normal text-gray-500'>{cliente.razaoSocial}</p>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                cliente.ativo
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-50 text-gray-700'
              }`}
            >
              {cliente.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          <div className='flex justify-between'>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className='flex items-center'>
                  <Mail className="h-4 w-4 mr-2" />
                  {cliente.email}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="h-4 w-4 mr-2" />
                {cliente.telefone}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FileText   className="h-4 w-4 mr-2" />
                {getDocumento(cliente)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                {cliente.enderecoCidade + " - " + cliente.enderecoEstado}
              </div>
              
            </div>

            <div className="space-y-2 ">
              <div className="relative group">
                <PencilIcon 
                  size={20} 
                  className="text-gray-700 cursor-pointer"
                  onClick={handleClick} 
                  data-id={cliente.documento}
                />

                <div className="absolute right-full mt-2 bottom-1/2 -translate-y-1/2 whitespace-nowrap
                        bg-gray-800 text-white text-xs rounded px-2 py-1 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                        z-[9999] shadow-lg">
                  Editar Dados
                </div>
              </div>

              <div className="relative group py-3">
                <ClipboardList 
                  size={20} 
                  className="text-gray-700 cursor-pointer" 
                  onClick={onClickHistorico}
                  data-id={cliente.documento}
                />
                <div className="absolute right-full mb-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-100">
                  Visualizar Dados
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

export default ClientesBox