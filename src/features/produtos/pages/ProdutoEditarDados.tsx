import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ChangeEvent, useEffect, useState } from 'react';
import Popup from '../../../components/layout/CustomPopUp';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Header } from '../../../components/layout/Header';
import { Produto } from '../types/produto';
import { ProdutoForm } from '../components/ProdutoForm';

type PopupType = 'success' | 'error' | 'alert' | null;
interface PopupState {
  type: PopupType;
  title: string;
  message: string;
  isOpen: boolean;
}

type Option = { 
  codigo: string;
  descricao: string;
};

type TributacaoOpcoes  = {
  cofinsSituacaoTributaria: Option[];
  icmsSituacaoTributaria: Option[];
  ipiSituacaoTributaria: Option[];
  pisSituacaoTributaria: Option[];
};

export function ProdutoEditarDados() {
   const navigate = useNavigate();
   const { userData, setProdutoData, produtoData} = useAuth(); 
   const [formData, setFormData] = useState<Produto>({} as Produto);
   const [originalData, setOriginalData] = useState<Produto>({} as Produto);
   const [tributacao, setTributacao] = useState<TributacaoOpcoes | null>(null);

   useEffect(()=>{ 
      getOpcoesTributacoes()
   }, []) 

   const apiUrl = import.meta.env.VITE_API_URL;
   const [popup, setPopup] = useState<PopupState>({
      type: null,
      title: '',
      message: '',
      isOpen: false
   });
   const [abaAtiva, setAbaAtiva] = useState<"basicos" | "financeiro" | "tributarias">("basicos");

   const handleInputChange = async (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;

      if (produtoData) {
         setProdutoData({
            ...produtoData,
            [name]: value,
         });
      }
   };

   const getOpcoesTributacoes = async () =>{
      try {
         const response = await fetch(apiUrl + 'tributacoes', {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userData?.token
         },
         });

         if (response.status != 200) {
         return false
         }

      let data = await response.json() as TributacaoOpcoes ;

      data = adicionarCodigoNaDescricao(data)
      

   
         setTributacao(data)
      } catch (err) {
         console.error("erro ao validar token: " + err);
      }
      return true
   }

   const adicionarCodigoNaDescricao = (dados: TributacaoOpcoes) => {
    for (const chave in dados) {
      const key = chave as keyof TributacaoOpcoes;
      const lista = dados[key];
      if (Array.isArray(lista)) {
        lista.forEach((item) => {
          item.descricao = `${item.codigo} - ${item.descricao}`;
        });
      }
    }
    return dados;
  }


   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      const updatedFields = getUpdatedFields()

      console.log(updatedFields)
      if (Object.keys(updatedFields).length === 0) {
         handleApiResponse( "alert", "Não há dados para atualizar")
         return;
      }
      
      try {
         await updateProduto(updatedFields);
         // Atualiza originalData somente após sucesso
         setOriginalData(current => ({
            ...current,
            ...updatedFields
         }));
         console.log('teste')
         handleApiResponse("sucess", "Produto atualizado com sucesso");
      } catch (error) {
         console.error(error);
         handleApiResponse("error", "Erro ao atualizar informações do produto");
      }
   }

   const updateProduto = async (updatedFields: Partial<Produto> ) => {
      const idProduto = produtoData?.id

      const response = await fetch(`${apiUrl}produtos/${idProduto}` , {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userData?.token
         },
         body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
         throw new Error('Erro ao atualizar informações do cliente');
      }
   }

   const getUpdatedFields = (): Partial<Produto> => {
      const updatedFields: Partial<Produto> = {};
      
      for (const key in produtoData) {
         const newValue = produtoData[key as keyof Produto];
         const originalValue = originalData[key as keyof Produto];

   
         if (newValue !== originalValue) {
            updatedFields[key as keyof Produto] = newValue as any;
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
            <div className="bg-white-100 p-4 flex-1">
               <Header/>
               <div className="h-auto rounded-lg shadow-md p-6">

                  <div className="mb-8">
                     <h1 className="text-3xl font-bold text-foreground mb-2">Cadastro de Produtos</h1>
                     <p className="text-muted-foreground">Preencha as informações do produto abaixo</p>
                  </div>

                  <div className="flex space-x-2 mb-6 ">
                     <button
                     className={`flex-1 w-full px-4 py-2 rounded ${abaAtiva === "basicos" ? "bg-blue-600 text-white" : "bg-white"}`}
                     onClick={() => setAbaAtiva("basicos")}
                     >
                     Dados Básicos
                     </button>
                     <button
                     className={`flex-1 w-full px-4 py-2 rounded ${abaAtiva === "financeiro" ? "bg-blue-600 text-white" : "bg-white"}`}
                     onClick={() => setAbaAtiva("financeiro")}
                     >
                     FInanceiro
                     </button>
                     
                     <button
                     className={`flex-1 w-full px-4 py-2 rounded ${abaAtiva === "tributarias" ? "bg-blue-600 text-white" : "bg-white"}`}
                     onClick={() => setAbaAtiva("tributarias")}
                     >
                     Tributação
                     </button>
                  </div>


                  <ProdutoForm
                     formData={produtoData as Produto}
                     onSubmit={handleSubmit}
                     onInputChange={handleInputChange}
                     buttonText="Atualizar"
                     abaAtiva={abaAtiva}
                     tributacao={tributacao}
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