import { ArrowLeft, Users } from 'lucide-react'
import { OftamologistaForm } from '../components/OftamologistaForm'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Oftalmologista, OftalmologistaEditar } from '../types/types';
import {  useEffect, useState } from 'react';
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

export function OftalmogistaEditarDados() {
   const navigate = useNavigate();
   const { userData, setOftalmologistaData, oftalmologistaData} = useAuth(); 
   const [formData, setFormData] = useState<Oftalmologista | OftalmologistaEditar>({} as Oftalmologista);
   const [emailError, setEmailError] = useState('');
   const [telefoneError, setTelefoneError] = useState('');
   const apiUrl = import.meta.env.VITE_API_URL;
   const [popup, setPopup] = useState<PopupState>({
      type: null,
      title: '',
      message: '',
      isOpen: false
   });

   useEffect(()=>{ 
      if (oftalmologistaData) {
         setFormData(oftalmologistaData);
      }
   }, [])
   
   const handleClickBack = () =>{
      navigate('/oftalmologista');
      setOftalmologistaData(undefined)
   }

   const handleInputChange = async (event: FormInputEvent) => {
      const { name, value } = event.target;

      let dado: string  = value as string

      if (name == 'telefone'){
         dado = FormatInfos.formatTelefone(value);
         validateTelefone(dado)
      }

      if (name == 'email'){
         validateEmail(dado)
      }

      setFormData(current => ({
         ...current,
         [name]: dado,
      }));
   };

   const validateEmail = (dado: string) =>{
      if (!ValidateInfos.validateEmail(dado)) {
         setEmailError('Email inválido');
      } else {
         setEmailError('');
      }
   }

   const validateTelefone = (dado: string) =>{
      if (!ValidateInfos.validateTelefone(dado)) {
         setTelefoneError('Telefone inválido');
      } else {
         setTelefoneError('');
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
         setOftalmologistaData({
            ...oftalmologistaData,
            ...updatedFields,
         } as Oftalmologista);
         handleApiResponse("sucess", "Fornecedor atualizado com sucesso");
      } catch (error) {
         console.error(error);
         handleApiResponse("error", "Erro ao atualizar informações do fornecedor");
      }
   }

   const updateCliente = async (updatedFields: Partial<Oftalmologista> ) => {
      const response = await fetch(`${apiUrl}oftalmologistas/${oftalmologistaData?.id}` , {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userData?.token
         },
         body: JSON.stringify(updatedFields),
      });

      handleApiResponse('sucess', "Fornecedor editado com sucesso")
      if (!response.ok) {
         throw new Error('Erro ao atualizar informações do Fornecedor');
      }
   }

   const getUpdatedFields = (): Partial<Oftalmologista> => {
      const updatedFields: Partial<Oftalmologista> = {};
      
      for (const key in oftalmologistaData) {
         const originalValue = oftalmologistaData[key as keyof Oftalmologista];
         const newValue = formData[key as keyof Oftalmologista];

         if (newValue !== undefined && newValue !== originalValue) {
            updatedFields[key as keyof Oftalmologista] = newValue as any;
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
                        <h1 className="text-2xl font-semibold text-gray-800"> Editar Fornecedor </h1>
                     </div>
                  </div>

                  <OftamologistaForm
                     formData={formData}
                     emailError={emailError}
                     telefoneError={telefoneError}
                     onSubmit={handleSubmit}
                     onInputChange={handleInputChange}
                     buttonText="Salvar"
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