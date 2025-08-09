import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import {Sidebar} from '../../../components/layout/Sidebar'
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { infosProdutos } from '../services/infosProdutos';
import Popup from "../../../components/layout/CustomPopUp"
import { useNavigate } from 'react-router-dom';
import { ProdutoForm } from '../components/ProdutoForm'
import { ProdutoFormData } from '../types/produto';

const initialFormData = infosProdutos

type FormInputEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  | { target: { name: 'ativo'; value: boolean } }
  | { target: { name: string; value: string  } };

type PopupType = 'success' | 'error' | null;
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

export function ProdutosCadastro() {
  
  const [formData, setFormData] = useState(initialFormData);
  const isInitialized = useRef(false);
  const { userData, isAuthenticated, logout } = useAuth();  
  const [tributacao, setTributacao] = useState<TributacaoOpcoes | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"basicos" | "financeiro" | "tributarias">("basicos");

  const infosValores: (keyof ProdutoFormData)[] = ['lucroPercentual', 'custoReposicao', 'valorVenda']

  useEffect(()=>{ 
    getOpcoesTributacoes()
  }, [])   
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate() 
   

  const [popup, setPopup] = useState<PopupState>({
    type: null,
    title: '',
    message: '',
    isOpen: false
  });

  const handleApiResponse = (success: boolean, message: string) => {
    if (success) {
      setPopup({
        type: 'success',
        title: 'Sucesso',
        message: 'CLIENTE CADASTRADO COM SUCESSO',
        isOpen: true
      });
    } else {
      setPopup({
        type: 'error',
        title: 'Erro',
        message: message || 'Ocorreu um erro ao cadastrar o cliente',
        isOpen: true
      });
    }
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };
  
  useEffect(() => {
    setFormData({
      ...formData,
      idOtica: String(userData?.id_oticas[0]), //   TODO 
    });
    isInitialized.current = true;
  }, []);  //   TODO: Não captura emailUsuarioCadastro
   
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }
 
  const handleInputChange = async (event: FormInputEvent) => {
    const { name, value } = event.target;

    if (name.includes('.')) {

      setFormData(prev => {
        const keys = name.split('.'); 

        const updated = { ...prev };

        let nested: any = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          nested[keys[i]] = { ...nested[keys[i]] };
          nested = nested[keys[i]];
        }

        nested[keys[keys.length - 1]] = value;

        return updated;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateInfos = () =>{

    console.log()

    let camposInvalidos = infosValores.forEach((campo) =>{
      const valor = formData[campo] as number | undefined;
      if (valor == null || valor <= 0){
        handleApiResponse(false, "Campos de valores invalidos" )
        return false
      }
    })

    console.log(formData)
    return true
  }

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
    e.preventDefault();
    if(!validateInfos()){
      return 
    }

    try {
      const response = await fetch(apiUrl + 'produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userData?.token
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json()
      const responseMessage = responseData.message || response.statusText || 'Erro ao cadastrar produto';

      handleApiResponse(response.ok, responseMessage)

      setErrorTokenExpirado(response.status)

      if (!response.ok) {
        throw new Error(responseMessage)
      }

      setFormData(initialFormData)
    } catch (err) {
      console.error("error: " + err);
    }
  };

  const setErrorTokenExpirado = (codStatus: number) => {
    if (codStatus == 401){
      logout()
      navigate('/', {state: {status: 401, message: "sessão expirada"}})
    }
  }

  return (
    <div className='flex w-full h-auto min-h-screen'>
      <Sidebar />
      <div className="bg-white-100 p-4 flex-1">
        
        <div className="h-auto rounded-lg shadow-md p-6 ">
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
            formData={formData}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            buttonText="Cadastrar"
            abaAtiva={abaAtiva}
            tributacao={tributacao}
          />
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
      </div>
    </div>
  );
}

export default ProdutosCadastro;