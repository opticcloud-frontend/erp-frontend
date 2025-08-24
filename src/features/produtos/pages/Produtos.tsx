import { useEffect, useState } from 'react';
import {Sidebar} from '../../../components/layout/Sidebar'
import { useAuth } from '../../../contexts/AuthContext';
import { Produto } from '../types/produto';
import { useEffectSkipFirst } from '../../../components/ui/useEffectSkipFirst';
import { Box, Filter, Search, Plus } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import Popup from '../../../components/layout/CustomPopUp';


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
  | { target: { name: string; value: string  } };

interface Filtro {
  nomeProduto?: string
  tipoProduto?: string
  marca?: string
  sku?: string
}
const dadosProduto: Produto[] = [];

export function Produtos() {
  const { userData, setProdutoData} = useAuth(); 
  const [produtos, setProdutos] = useState<Produto[]>(dadosProduto);
  const [totalCliente, setTotalProduto] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [hasNext, setHasNext] = useState(Boolean)
  const [hasPrevious, setHasPrevious] = useState(Boolean)
  const [currentPage, setCurrentPage] = useState(0)
  const clientePerPage = 5
  const apiUrl = import.meta.env.VITE_API_URL;
  const idOtica = userData?.id_oticas[0]

  const [filtro, setFiltro] = useState<Filtro>();
  const navigate = useNavigate();

  useEffectSkipFirst(() => {
    if(currentPage >= 0 && currentPage < totalPage){
      if (filtro != undefined){
        filterProdutos()
      } else {
        getProdutos();
      }
    } 
  }, [currentPage])

  useEffect(() =>{
    getProdutos()
  },[])

  const [popup, setPopup] = useState<PopupState>({
    type: null,
    title: '',
    message: '',
    isOpen: false
  });

  const previousPage = () => {
    if (hasPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleChange = (event: FormInputEvent) =>{
    const { name, value } = event.target;

    setFiltro((prevFiltro) => ({
      ...prevFiltro,
      [name]: value,
    }));
  }

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

  const nextPage = () => {
    if (hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const filterProdutos = async () => {
    const params = new URLSearchParams();

    if (filtro?.nomeProduto) params.append('nomeProduto', filtro.nomeProduto);
    if (filtro?.tipoProduto) params.append('tipoProduto', filtro.tipoProduto);
    if (filtro?.marca) params.append('marca', filtro.marca);
    if (filtro?.sku) params.append('sku', filtro.sku);


    const response = await fetch(`${apiUrl}produtos?idOtica=${idOtica}&${params.toString()}&page=${currentPage}&size=${clientePerPage}` , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userData?.token
      },
    });

    if (!response.ok) {
      throw new Error('Produto não encontrado');
    }

    const data = await response.json();


    setTotalProduto(data.totalElements)
    setTotalPage(data.totalPages)
    setHasNext(data.hasNext)
    setHasPrevious(data.hasPrevious)

    const listProdutos = data.content;
    if (!listProdutos.length){
      handleApiResponse( "alert", "Nenhum produto encontrado!")
      setProdutos([])
      return
    }
    setProdutos(listProdutos)
  }

  const getProdutos = async () => {  
    const response = await fetch(`${apiUrl}produtos?idOtica=${idOtica}&page=${currentPage}&size=${clientePerPage}` , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userData?.token
      },
    });

    if (!response.ok) {
      throw new Error('Produto não encontrado');
    }
    
    const data = await response.json();

    setTotalProduto(data.totalElements)
    setTotalPage(data.totalPages)
    setHasNext(data.hasNext)
    setHasPrevious(data.hasPrevious)

    const listProdutos = data.content;
    if (!listProdutos.length){
      handleApiResponse( "alert", "Nenhum produto encontrado!")
      setProdutos([])
      return
    }
    setProdutos(listProdutos)
  }
  
  const novoProduto = () => {
    navigate('/produtos/cadastrar');
  }

  const editarProduto = (e: React.MouseEvent<HTMLButtonElement>) => {
    const idProduto = e.currentTarget.getAttribute("data-id")
    const produtoEditar = produtos.find((produto) => {
      if( produto.id === idProduto) {
          return produto
      }
    });
    
    setProdutoData(produtoEditar)
    navigate('/produto/editar');
  }

  const limparFiltros = () => setFiltro(undefined);
  

  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar/>
      <div className="flex-1 space-y-6">
        <Header/>
        <div className='p-6'>
        
          <div className="space-y-2">
            <div className='flex items-center gap-3'>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Box className="h-6 w-6 text-primary"/>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                <p className="text-muted-foreground">Gerencie seus produtos de forma eficiente</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                <Filter className="h-5 w-5"/>
                Filtros de Busca
              </h3>
            </div>
            <div className="space-y-4 p-6 pt-0">
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Produto</label>
                  <input
                    placeholder='Buscar por nome...'
                    name='nomeProduto'
                    value={filtro?.nomeProduto ?? ''}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU</label>
                  <input
                    placeholder='Código SKU'
                    name='sku'
                    value={filtro?.sku ?? ""}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marca</label>
                  <input
                    placeholder='Nome da marca'
                    name='marca'
                    value={filtro?.marca ?? ""}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    name='tipoProduto'  
                    onChange={handleChange}
                    value={filtro?.tipoProduto ?? ""}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Lente">Lente</option>
                    <option value="Armacao">Armação</option>
                    <option value="Acessorio">Acessório</option>
                    <option value="Outro">Outro</option>
                    <option value="Oculos de sol">Óculos de sol</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={filterProdutos} className="justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex items-center gap-2">
                  <Search className="h-4 w-4"/>
                  Buscar Produtos
                </button>
                <button onClick={limparFiltros} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold leading-none tracking-tight">Lista de Produtos</h3>
                <button 
                  onClick={novoProduto}
                  className="justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4"/>
                  
                  Novo Produto
                </button>
              </div>
            </div>
            <div className="p-0">
              <div className='overflow-x-auto'>
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="font-medium h-12 px-4 text-left text-sm text-muted-foreground">Nome</th>
                      <th className="font-medium h-12 px-4 text-left text-sm text-muted-foreground">SKU</th>
                      <th className="font-medium h-12 px-4 text-left text-sm text-muted-foreground">Marca</th>
                      <th className="font-medium h-12 px-4 text-left text-sm text-muted-foreground">Modelo</th>
                      <th className="font-medium h-12 px-4 text-left text-sm text-muted-foreground">Cor</th>
                      <th className="font-medium h-12 px-4 text-right text-sm text-muted-foreground">Preço Venda</th>
                      <th className="font-medium h-12 px-4 text-right text-sm text-muted-foreground">Custo</th>
                      <th className="font-medium h-12 px-4 text-right text-sm text-muted-foreground">Lucro %</th>
                      <th className="font-medium h-12 px-4 text-center text-sm text-muted-foreground">Status</th>
                      <th className="font-medium h-12 px-4 text-left text-sm text-muted-foreground">Cadastro</th>
                      <th className="font-medium h-12 px-4 text-center text-sm text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="h-32 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Box className="h-8 w-8 text-muted-foreground/50"/>
                            <span>Nenhum produto encontrado</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      produtos.map((produto, index) => (
                        <tr key={index}  className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-medium">{produto.nome}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{produto.sku}</td>
                          <td className="px-4 py-3">{produto.marca}</td>
                          <td className="px-4 py-3">{produto.modelo}</td>
                          <td className="px-4 py-3">{produto.cor}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            R$ {produto.valorVenda?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            R$ {produto.custoReposicao?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-green-600 font-medium">{produto.lucroPercentual}%</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={produto.ativo ? "text-green-500" : "text-red-500"}>{produto.ativo ? 'Ativo' : 'Inativo'}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {produto.dataCadastro}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              data-id={produto.id}
                              onClick={editarProduto}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className='w-full p-3 bg-white-300 gap-2 flex justify-between'>
                <div>
                  <p>Exibindo {Math.min(clientePerPage, totalCliente - currentPage * clientePerPage)} de {totalCliente}</p>
                </div>
                <div className='flex gap-2 items-center'>
                  <button
                    onClick={previousPage}
                    disabled={!hasPrevious}
                    className={`cursor-pointer px-3 py-1 rounded border border-gray-300 ${!hasPrevious ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300 hover:shadow-md'}`}
                  >
                    Anterior
                  </button>

                  <div className='flex gap-2'>
                    {Array.from({ length: totalPage })
                      .slice(Math.floor(currentPage / 3) * 3, Math.floor(currentPage / 3) * 3 + 3)
                      .map((_, index) => {
                        const pageIndex = Math.floor(currentPage / 3) * 3 + index;
                        return (
                          <button
                            key={pageIndex}
                            onClick={() => setCurrentPage(pageIndex)}
                            className={`w-10 text-center border rounded ${currentPage === pageIndex ? 'bg-blue-200 border-blue-400' : 'bg-white border-gray-300 hover:border-blue-300 hover:shadow-md'}`}
                          >
                            {pageIndex + 1}
                          </button>
                        );
                      })}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={!hasNext}
                    className={`cursor-pointer px-3 py-1 rounded border border-gray-300 ${!hasNext ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300 hover:shadow-md'}`}
                  >
                    Próximo
                  </button>
                </div>
              </div>

            
            </div>
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
    </div>
  );
}

export default Produtos