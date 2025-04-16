import { ArrowLeft, Users } from 'lucide-react'
import { ClientForm } from '../components/ClienteForm'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { infosClientes } from '../../../services/infosClientes';
import { Cliente } from '../types/types';
import { ChangeEvent, useState } from 'react';
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
const initialFormData = infosClientes

export function ClienteEditeDados() {
   const navigate = useNavigate();
   const { userData, setCliente, clienteData} = useAuth(); 
   const [formData, setFormData] = useState<Cliente>({} as Cliente);
   const [originalData, setOriginalData] = useState<Cliente>({} as Cliente);
   const [infosAdicionais, setInfosAdicionais] = useState(false);
   const [displayDocumento, setDisplayDocumento] = useState(''); 
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
   
   const handleClickBack = () =>{
      navigate('/clientes');
   }
   const handleClickInfosGerais = () =>{
      setInfosAdicionais(false)
   }

   const handleClickInfosAdicionais = () =>{
      setInfosAdicionais(true)
   }

   const handleBlurCEP = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const cep = event.target.value.replace(/\D/g, ''); 

      if(!cep) return
      
      try {
         const data = await fetchCEPData(cep);
   
         if (data) {
            data.enderecoCep = FormatInfos.formatCep(data.enderecoCep);
         
            setFormData(prev => ({
               ...prev,
               ...data
            }));
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
         enderecoBairro: data.neighborhood || formData.enderecoBairro,
         enderecoCidade: data.city || formData.enderecoCidade,
         enderecoCep: data.cep || formData.enderecoCep, 
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
   
            setFormData(prev => ({
               ...prev,
               ...data
            }));
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
            razaoSocial: data.razao_social || formData.razaoSocial,
            email: data.email || formData.email,
            enderecoLogradouro: data.logradouro || formData.enderecoLogradouro,
            enderecoNumero: data.numero || formData.enderecoNumero,
            enderecoCidade: data.municipio || formData.enderecoCidade,
            enderecoBairro: data.bairro || formData.enderecoBairro,
            nomeFantasia: data.nome_fantasia || formData.nomeFantasia,
            enderecoComplemento: data.complemento || formData.enderecoComplemento,
            enderecoCep: data.cep || formData.enderecoCep,
            telefone: data.ddd_telefone_1 || formData.telefone,
         };
      } catch (error) {
        console.error('Erro ao buscar dados do CNPJ ', error);
      }
   };

   const handleInputChange = async (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;

      if (name === 'enderecoCep') {
         const formattedCEP = FormatInfos.formatCep(value);
         setFormData(current => ({
            ...current,
            [name]: formattedCEP,
         }));
      } else {
      setFormData(current => ({
         ...current,
         [name]: value,
      }));
      }
   };

   const handleInputChangeDocumento = async (
      e: ChangeEvent<HTMLInputElement>
   ) => {
      const {value} = e.target;
      const resp = await setInputDocumento(value)
      if(resp){
         return
      }
   }

   const setInputDocumento = async (value: string) =>{
      const documentoDigitos = value.replace(/\D/g, '');
      let formattedDoc = '';

      if (formData.descricaoTipoCliente === 'PESSOA_FISICA') {
         formattedDoc = FormatInfos.formatCPF(value);
         setDisplayDocumento(formattedDoc);

         if (!value) {
            setDocumentoError('');
            return false; 
         }

         if (!ValidateInfos.validateCPF(documentoDigitos)) { 
            setDocumentoError('CPF inválido'); 
         } else {
            setDocumentoError('');
         }

      } else {
         formattedDoc = FormatInfos.formatCNPJ(value);
         setDisplayDocumento(formattedDoc);
      }

      setFormData(current => {
         if (current) {
            return {
               ...current,
               documento: documentoDigitos,
            };
         }
         return current; 
      });
      return true
   }

   const handleInputChangeEmailCliente = (
         e: ChangeEvent<HTMLInputElement> 
      ) => {
      const {name, value } = e.target;

      setFormData(current => ({
         ...current,
         [name]: value,
      }));

      if (!value) {
         setEmailError('');
         return;
      }

      if (!ValidateInfos.validateEmail(value)) {
         setEmailError('Email inválido');
      } else {
         setEmailError('');
      }
   }

   const handleInputChangeTelefone = (
         e: ChangeEvent<HTMLInputElement> 
      ) => {
      const { name, value } = e.target;
      const formattedTelefone = FormatInfos.formatTelefone(value);

      if (!ValidateInfos.validateTelefone(formattedTelefone)) {
         setTelefoneError('Telefone inválido');
      } else {
         setTelefoneError('');
      }

      setFormData(current => ({
         ...current,
         [name]: formattedTelefone,
      }));
   }

   const handleInputChangeEnderecoCep = (
      e: ChangeEvent<HTMLInputElement> 
   ) => {
      const { name, value } = e.target;

      const formattedCEP = FormatInfos.formatCep(value);
      setFormData(current => ({
         ...current,
         [name]: formattedCEP,
      }));
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const updatedFields = getUpdatedFields()
      if (Object.keys(updatedFields).length === 0) {
         handleApiResponse( "alert", "Não há dados para atualizar")
         return;
      }

      updateCliente(updatedFields)
   }

   const updateCliente = async (updatedFields: Partial<Cliente> ) => {
      const idOtica = userData?.id_oticas[0]

      const response = await fetch(`${apiUrl}clientes/idOtica=${idOtica}?documento=${formData.documento}` , {
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
      for (const key in formData) {
         const newValue = formData[key as keyof Cliente];
         const originalValue = originalData[key as keyof Cliente];

   
         if (newValue !== originalValue) {
            updatedFields[key as keyof Cliente] = newValue as any;
            setOriginalData(current => ({
               ...current,
               [key]: newValue,
            }));
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
                        <h1 className="text-2xl font-semibold text-gray-800">
                        Editar Cliente
                        </h1>
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
                     formData={clienteData as Cliente}
                     buttonText="Salvar"
                     displayDocumento={displayDocumento}
                     onBlurCEP={handleBlurCEP}
                     onBlurCNPJ={handleBlurCNPJ}
                     onInputChange={handleInputChange}
                     onInputChangeDocumento={handleInputChangeDocumento}
                     onInputChangeEmailCliente={handleInputChangeEmailCliente}
                     onInputChangeTelefone={handleInputChangeTelefone}
                     onInputChangeEnderecoCep={handleInputChangeEnderecoCep}
                     documentoError={documentoError}
                     emailError={emailError}
                     telefoneError={telefoneError}
                     onSubmit={handleSubmit}
                     disabled={true}
                     infosAdicionais={infosAdicionais}
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