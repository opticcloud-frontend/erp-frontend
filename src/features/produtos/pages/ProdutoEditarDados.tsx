import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ChangeEvent, useEffect, useState } from 'react';
import Popup from '../../../components/layout/CustomPopUp';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Header } from '../../../components/layout/Header';
import { Produto, ProdutoFormEditData } from '../types/produto';
import { ProdutoForm } from '../components/ProdutoForm';
import { ArrowLeft, Users } from 'lucide-react'


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
  icmsAliquota: number;
  pisAliquota : number;
  cofinsAliquota  : number;
  ipiAliquota   : number;
  cofinsSituacaoTributaria: Option[];
  icmsSituacaoTributaria: Option[];
  ipiSituacaoTributaria: Option[];
  pisSituacaoTributaria: Option[];
};

type TributacaoProduto  = {
  icmsAliquota: number;
  pisAliquota : number;
  cofinsAliquota  : number;
  ipiAliquota   : number;
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
      if (produtoData) {
         setFormData(produtoData);
      }
      getOpcoesTributacoes()
      console.log(produtoData)
   }, [])  

   const apiUrl = import.meta.env.VITE_API_URL;
   const [popup, setPopup] = useState<PopupState>({
      type: null,
      title: '',
      message: '',
      isOpen: false
   });
   const [abaAtiva, setAbaAtiva] = useState<"basicos" | "financeiro" | "tributarias">("basicos");

   const converters: Record<string, (v: string | boolean) => any> = {
      icmsAliquota: v => parseFloat(v as string) || 0,
      pisAliquota: v => parseFloat(v as string) || 0,
      cofinsAliquota: v => parseFloat(v as string) || 0,
      ipiAliquota: v => parseFloat(v as string) || 0,
      custoReposicao: v => parseFloat(v as string) || 0,
      lucroPercentual: v => parseFloat(v as string) || 0,
      valorVenda: v => parseFloat(v as string) || 0,
      ativo: v => String(v).toLowerCase() === "true",
   };

   const handleInputChange = async (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;

      const converter = converters[name];
      const convertedValue = converter ? converter(value) : value;


      console.log(convertedValue)

      if (name.includes('.')) {
         setFormData(prev => {
         const keys = name.split('.'); 

         const updated = { ...prev };

         let nested: any = updated;
         for (let i = 0; i < keys.length - 1; i++) {
            nested[keys[i]] = { ...nested[keys[i]] };
            nested = nested[keys[i]];
         }

         nested[keys[keys.length - 1]] = convertedValue;

         return updated;
         });
      } else if (formData){
         setFormData({
            ...formData,
            [name]: convertedValue,
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

      if (Object.keys(updatedFields).length === 0) {
         handleApiResponse( "alert", "Não há dados para atualizar")
         return;
      }
      
      try {
         await updateProduto(updatedFields);
         setProdutoData({
         ...produtoData,
         ...updatedFields,
         } as Produto);
         handleApiResponse("success", "Produto atualizado com sucesso");
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
         const originalValue = produtoData[key as keyof Produto];
         const newValue = formData[key as keyof Produto];

         if (newValue !== undefined && newValue !== originalValue) {
            updatedFields[key as keyof Produto] = newValue as any;
         }
      }
      return updatedFields;
   };

   console.log(formData)

   const handleApiResponse = (typePopPup: string = "", message: string) => {
      if(typePopPup == "alert"){
         setPopup({
            type: 'alert',
            title: 'Alerta',
            message: message,
            isOpen: true
         });
      }


      if (typePopPup == "success") {
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

   const handleClickBack = () =>{
      navigate('/produtos');
   }

   return(
      <div className='flex w-full'>
         <Sidebar/>
            <div className="min-h-screen bg-white-100   flex-1">
               <Header/>
               <div className="h-auto rounded-lg shadow-md p-6">


                  <div className="mb-8">
                     <div className='flex items-center gap-2'>
                        <ArrowLeft className='cursor-pointer' onClick={handleClickBack}/>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Editar Produto</h1>
                     </div>
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
                     formData={formData as Produto}
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