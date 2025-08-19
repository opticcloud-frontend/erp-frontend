import { ArrowLeft, Users } from 'lucide-react'
import { FornecedoresForm } from '../components/FornecedoresForm'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { infosClientes } from '../../../services/infosClientes';
import { Fornecedor } from '../types/types';
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

export function FornecedorEditarDados() {
   const navigate = useNavigate();
   const { userData, setFornecedorData, fornecedorData} = useAuth(); 
   const [formData, setFormData] = useState<Fornecedor>({} as Fornecedor);
   const [originalData, setOriginalData] = useState<Fornecedor>({} as Fornecedor);
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
      navigate('/fornecedores');
      setFornecedorData(undefined)
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

            if (fornecedorData) {
               setFornecedorData({
                 ...fornecedorData,
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
         enderecoBairro: data.neighborhood || fornecedorData?.enderecoBairro,
         enderecoCidade: data.city || fornecedorData?.enderecoCidade,
         enderecoCep: data.cep || fornecedorData?.enderecoCep, 
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
   
            if (fornecedorData) {
               setFornecedorData({
                 ...fornecedorData,
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
            razaoSocial: data.razao_social || fornecedorData?.razaoSocial,
            email: data.email || fornecedorData?.email,
            enderecoLogradouro: data.logradouro || fornecedorData?.enderecoLogradouro,
            enderecoNumero: data.numero || fornecedorData?.enderecoNumero,
            enderecoCidade: data.municipio || fornecedorData?.enderecoCidade,
            enderecoBairro: data.bairro || fornecedorData?.enderecoBairro,
            nomeFantasia: data.nome_fantasia || fornecedorData?.nomeFantasia,
            enderecoComplemento: data.complemento || fornecedorData?.enderecoComplemento,
            enderecoCep: data.cep || fornecedorData?.enderecoCep,
            telefone: data.ddd_telefone_1 || fornecedorData?.telefone,
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
         const formattedCEP = FormatInfos.formatCep(value); // TODO
         if (fornecedorData) {
            setFornecedorData({
               ...fornecedorData,
               ['enderecoCep']: formattedCEP,
             });
         }
      } else {
         if (fornecedorData) {
            setFornecedorData({
              ...fornecedorData,
              [name]: value,
            });
         }
         
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

      formattedDoc = FormatInfos.formatCNPJ(value);
      setDisplayDocumento(formattedDoc);


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

      if (fornecedorData) {
         setFornecedorData({
           ...fornecedorData,
           [name]: value,
         });
      }

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

      if (fornecedorData) {
         setFornecedorData({
           ...fornecedorData,
           [name]: formattedTelefone,
         });
      }
   }

   const handleInputChangeEnderecoCep = (
      e: ChangeEvent<HTMLInputElement> 
   ) => {
      const { name, value } = e.target;

      const formattedCEP = FormatInfos.formatCep(value);
      if (fornecedorData) {
         setFornecedorData({
           ...fornecedorData,
           [name]: formattedCEP,
         });
      }

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

   const updateCliente = async (updatedFields: Partial<Fornecedor> ) => {
      const idOtica = userData?.id_oticas[0]

      console.log(updatedFields)

      const response = await fetch(`${apiUrl}fornecedores?idOtica=${idOtica}&cnpj=${fornecedorData?.cnpj.replace(/\D/g, '')}` , {
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

   const getUpdatedFields = (): Partial<Fornecedor> => {
      const updatedFields: Partial<Fornecedor> = {};
      for (const key in fornecedorData) {
         const newValue = fornecedorData[key as keyof Fornecedor];
         const originalValue = originalData[key as keyof Fornecedor];

   
         if (newValue !== originalValue) {
            updatedFields[key as keyof Fornecedor] = newValue as any;
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
                        <h1 className="text-2xl font-semibold text-gray-800"> Editar Cliente </h1>
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

                  <FornecedoresForm
                     formData={fornecedorData as Fornecedor}
                     buttonText="Salvar"
                     onBlurCEP={handleBlurCEP}
                     onBlurCNPJ={handleBlurCNPJ}
                     onInputChange={handleInputChange}
                     onInputChangeDocumento={handleInputChangeDocumento}
                     onInputChangeEmailCliente={handleInputChangeEmailCliente}
                     onInputChangeTelefone={handleInputChangeTelefone}
                     onInputChangeEnderecoCep={handleInputChangeEnderecoCep}
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