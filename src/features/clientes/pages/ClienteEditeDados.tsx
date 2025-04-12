import { ArrowLeft, Users } from 'lucide-react'
import { ClientForm } from '../components/ClienteForm'
import { ClientEditProps } from '../types/client';



export const ClienteEditeDados: React.FC<ClientEditProps> = ({
   formData,
   documentoError,
   emailError,
   telefoneError,
   displayDocumento,
   clientes,
   handleSubmit,
   handleClickBack,
   handleClickInfosGerais,
   handleClickInfosAdicionais,
   handleInputChangeDocumento,
   handleInputChangeEmailCliente,
   handleInputChangeTelefeone,
   handleInputChange,
   handleInputChangeEnderecoCep,
   handleBlurCEP,
   handleBlurCNPJ,
   infosAdicionais
 }) => {
   return(
      <>
         <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
               <ArrowLeft className='cursor-pointer' onClick={handleClickBack}/>
               <div className="bg-blue-600 p-2 rounded-lg">
               <Users className="h-6 w-6 text-white" />
               </div>
               <h1 className="text-2xl font-semibold text-gray-800">
               Editar Cliente
               </h1>
            </div>
            <div className="text-sm text-gray-500">
               {clientes.length} Cliente(s) encontrado(s)
            </div>
         </div>
         <div className='flex items-center gap-5 mb-5 text-center bg-gray-200 p-1 rounded-lg'>
            <p 
               className={`${infosAdicionais ? "bg-gray-200": "bg-gray-100 "} text-sm font-medium text-gray-700 p-2 w-3/6 cursor-pointer rounded-lg transition duration-300`}
               onClick={handleClickInfosGerais}
            >
               Dados Pessoais
            </p>
            <p 
               className={`${infosAdicionais ? "bg-gray-100": "bg-gray-200"} rounded-lg text-sm font-medium text-gray-700 p-2 w-3/6 cursor-pointer duration-300`} 
               onClick={handleClickInfosAdicionais}>
               Informações Adicionais
            </p>
         </div>

         <ClientForm
            formData={formData}
            buttonText="Salvar"
            displayDocumento={displayDocumento}
            onBlurCEP={handleBlurCEP}
            onBlurCNPJ={handleBlurCNPJ}
            onInputChange={handleInputChange}
            onInputChangeDocumento={handleInputChangeDocumento}
            onInputChangeEmailCliente={handleInputChangeEmailCliente}
            onInputChangeTelefone={handleInputChangeTelefeone}
            onInputChangeEnderecoCep={handleInputChangeEnderecoCep}
            documentoError={documentoError}
            emailError={emailError}
            telefoneError={telefoneError}
            onSubmit={handleSubmit}
            disabled={true}
            infosAdicionais={infosAdicionais}
         />
      </>
   )
}