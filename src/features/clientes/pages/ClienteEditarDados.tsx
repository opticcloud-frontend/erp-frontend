import { ArrowLeft, Users } from 'lucide-react'
import { ClientForm } from '../components/ClienteForm'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Cliente } from '../types/types';
import { useEffect, useState } from 'react';
import { FormatInfos } from '../../../services/FormatInfos';
import { ValidateInfos } from '../../../services/ValidateInfos';
import Popup from '../../../components/layout/CustomPopUp';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Header } from '../../../components/layout/Header';

type PopupType = 'success' | 'error' | 'alert' | null;
interface PopupState {
  type: PopupType;
  title: string;
  message: string;
  isOpen: boolean;
}

type FormInputEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  | { target: { name: 'ativo'; value: boolean } }
  | { target: { name: string; value: string } };


export function ClienteEditarDados() {
   const navigate = useNavigate();
   const { userData, setClienteData, clienteData} = useAuth(); 
   const [formData, setFormData] = useState<Cliente>({} as Cliente);
   const [documentoError, setDocumentoError] = useState('');
   const [emailError, setEmailError] = useState('');
   const [telefoneError, setTelefoneError] = useState('');
   const apiUrl = import.meta.env.VITE_API_URL;
   const [popup, setPopup] = useState<PopupState>({
      type: null,
      title: '',
      message: '',
      isOpen: false
   });
   const [abaAtiva, setAbaAtiva] = useState<"pessoais" | "endereço">("pessoais");

   useEffect(()=>{ 
      if (clienteData) {
         setFormData(clienteData);
      }
   }, [])
   
   const handleClickBack = () =>{
      navigate('/clientes');
      setClienteData(undefined)
   }

   const handleBlurCEP = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const cep = event.target.value.replace(/\D/g, ''); 

      if(!cep) return
      
      try {
         const data = await fetchCEPData(cep);
   
         if (data) {
            data.enderecoCep = FormatInfos.formatCep(data.enderecoCep);

            if (formData) {
               setFormData({
                 ...formData,
                 ...data
               });
            }
         }
      } catch (error) {
         console.error('Erro ao buscar dados do CEP', error);
      }

   };

   const fetchCEPData = async (cep: string) => {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      if (!response.ok) { 
         throw new Error('CEP não encontrado');
      }

      const data = await response.json();      
      
      return {
         enderecoBairro: data.neighborhood || clienteData?.enderecoBairro,
         enderecoCidade: data.city || clienteData?.enderecoCidade,
         enderecoCep: data.cep || clienteData?.enderecoCep, 
      }; 
   };

   const handleBlurCNPJ = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const cnpj = event.target.value.replace(/\D/g, ''); 

      if(!cnpj) return

      try {
         const data = await fetchCNPJData(cnpj);

         if(data){
            data.enderecoCep = FormatInfos.formatCep(data.enderecoCep);
            data.telefone = FormatInfos.formatTelefone(data.telefone);
   
            if (formData) {
               setFormData({
                 ...formData,
                 ...data
               });
            }
         }
      } catch (error) {
         console.error('Erro ao buscar dados do CNPJ', error)
      }

   };

   const fetchCNPJData = async (cnpj: string) => {
      try {
         const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
         if (!response.ok) {
            throw new Error('CNPJ não encontrado');
         }
         const data = await response.json();
        
         return {
            razaoSocial: data.razao_social || clienteData?.razaoSocial,
            email: data.email || clienteData?.email,
            enderecoLogradouro: data.logradouro || clienteData?.enderecoLogradouro,
            enderecoNumero: data.numero || clienteData?.enderecoNumero,
            enderecoCidade: data.municipio || clienteData?.enderecoCidade,
            enderecoBairro: data.bairro || clienteData?.enderecoBairro,
            nomeFantasia: data.nome_fantasia || clienteData?.nomeFantasia,
            enderecoComplemento: data.complemento || clienteData?.enderecoComplemento,
            enderecoCep: data.cep || clienteData?.enderecoCep,
            telefone: data.ddd_telefone_1 || clienteData?.telefone,
         };
      } catch (error) {
        console.error('Erro ao buscar dados do CNPJ ', error);
      }
   };

   const handleInputChange = async (event: FormInputEvent) => {
      const { name, value } = event.target;

      if (name === 'ativo') {
         const isActive = value === 'active';
         setFormData(current => ({
            ...current,
            ativo: isActive, 
         }));
         return; 
      }

      let dado: string  = value as string

      if (name == 'enderecoCep'){
         dado = FormatInfos.formatCep(value);
      }

      if (name == 'telefone'){
         dado = FormatInfos.formatTelefone(value);
         validateTelefone(dado)
      }

      if (name == 'email'){
         validateEmail(dado)
      }

      if (name == 'cnpj'){
         dado = FormatInfos.formatCNPJ(value);
      }

      if (formData.descricaoTipoCliente === 'PESSOA_FISICA' && name == 'documento') {
         dado = FormatInfos.formatCPF(dado);
         validateCPF(dado)
      } 

      if (formData.descricaoTipoCliente === 'PESSOA_JURIDICA' && name == 'documento') {
         dado = FormatInfos.formatCNPJ(dado);
      } 

      setFormData(current => ({
         ...current,
         [name]: dado,
      }));
   };

   const validateCPF = (dado: string) =>{
       if (!dado || !ValidateInfos.validateCPF(dado)) {
         setDocumentoError(dado ? 'CPF inválido' : '');
      } else {
         setDocumentoError('');
      }
   }

   const validateTelefone = (dado: string) =>{
      if (!ValidateInfos.validateTelefone(dado)) {
         setTelefoneError('Telefone inválido');
      } else {
         setTelefoneError('');
      }
   }

   const validateEmail = (dado: string) =>{
      if (!ValidateInfos.validateEmail(dado)) {
         setEmailError('Email inválido');
      } else {
         setEmailError('');
      }
   }

   const validateInfos = () =>{
      if (!ValidateInfos.validateEmail(formData.email) && formData.email != "") { 
         return false;
      }
      
      if (!ValidateInfos.validateTelefone(formData.telefone)) {
         return false;
      }
      
      return true
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const updatedFields = getUpdatedFields()
      if (Object.keys(updatedFields).length === 0) {
         handleApiResponse( "alert", "Não há dados para atualizar")
         return;
      }

      if(!validateInfos()){
         return 
      }

       try {
         await updateCliente(updatedFields)
         setClienteData({
            ...clienteData,
            ...updatedFields,
         } as Cliente);
         handleApiResponse("sucess", "Cliente atualizado com sucesso");
      } catch (error) {
         console.error(error);
         handleApiResponse("error", "Erro ao atualizar informações do cliente");
      }
   }

   const updateCliente = async (updatedFields: Partial<Cliente> ) => {
      const idOtica = userData?.id_oticas[0]

      const response = await fetch(`${apiUrl}clientes/idOtica=${idOtica}?documento=${clienteData?.documento.replace(/\D/g, '')}` , {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userData?.token
         },
         body: JSON.stringify(updatedFields),
      });

      handleApiResponse('sucess', "Usuario editado com sucesso")
      if (!response.ok) {
         throw new Error('Erro ao atualizar informações do cliente');
      }
   }

   const getUpdatedFields = (): Partial<Cliente> => {
      const updatedFields: Partial<Cliente> = {};
      
      for (const key in clienteData) {
         const originalValue = clienteData[key as keyof Cliente];
         const newValue = formData[key as keyof Cliente];

         if (newValue !== undefined && newValue !== originalValue) {
            updatedFields[key as keyof Cliente] = newValue as any;
         }
      }
      return updatedFields;
   };

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

   return(
      <div className='flex w-full '>
         <Sidebar/>
            <div className="min-h-screen bg-white-100  flex-1">
               <Header/>
               <div className="bg-white-200 rounded-lg shadow-md p-6 h-full">

                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center space-x-2">
                        <ArrowLeft className='cursor-pointer' onClick={handleClickBack}/>
                        <div className="bg-blue-600 p-2 rounded-lg">
                           <Users className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-800"> Editar Cliente </h1>
                     </div>
                  </div>
                  <div className="flex space-x-2 mb-6 ">
                     <button
                        className={`flex-1 w-full px-4 py-2 rounded ${abaAtiva === "pessoais" ? "bg-blue-600 text-white" : "bg-white"}`}
                        onClick={() => setAbaAtiva("pessoais")}
                     >
                     Dados Pessoais
                     </button>
                     <button
                        className={`flex-1 w-full px-4 py-2 rounded ${abaAtiva === "endereço" ? "bg-blue-600 text-white" : "bg-white"}`}
                        onClick={() => setAbaAtiva("endereço")}
                     >
                     Endereço
                     </button>
                  </div>

                  <ClientForm
                     formData={formData as Cliente}
                     buttonText="Salvar"
                     onBlurCEP={handleBlurCEP}
                     onBlurCNPJ={handleBlurCNPJ}
                     onInputChange={handleInputChange}
                     documentoError={documentoError}
                     emailError={emailError}
                     telefoneError={telefoneError}
                     onSubmit={handleSubmit}
                     disabled={true}
                     abaAtiva={abaAtiva}
                  />

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
   )
}