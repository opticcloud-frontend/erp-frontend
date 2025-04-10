import { User, Building2, Phone, Mail, MapPin, FileText    } from 'lucide-react';
import type { Cliente } from '../types/types';
import { FormatInfos } from '../../../services/FormatInfos';

interface CustomerListProps {
  clientes: Cliente[];
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function ClientesBox({ clientes, handleClick }: CustomerListProps) {
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clientes.map((cliente) => (
        <div
          key={cliente.documento}
          data-id={cliente.documento}
          onClick={handleClick}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer transform hover:scale-105 transition-transform duration-100"
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
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="h-4 w-4 mr-2" />
              {cliente.email}
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
        </div>
      ))}
    </div>
    </>
  );
}

export default ClientesBox