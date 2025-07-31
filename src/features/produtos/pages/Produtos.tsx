import { useEffect, useState } from 'react';
import {Sidebar} from '../../../components/layout/Sidebar'
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { useAuth } from '../../../contexts/AuthContext';
import { Produto } from '../types/produto';
import { useEffectSkipFirst } from '../../../components/ui/useEffectSkipFirst';
import { p } from 'framer-motion/client';
import { Box, Filter } from 'lucide-react';

type PopupType = 'success' | 'error' | 'alert' | null;
interface PopupState {
  type: PopupType;
  title: string;
  message: string;
  isOpen: boolean;
}

const dadosProduto: Produto[] = [];

export function Produtos() {
  const { userData, setClienteData} = useAuth(); 
  const [produtos, setProdutos] = useState<Produto[]>(dadosProduto);
  const [totalCliente, setTotalProduto] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [hasNext, setHasNext] = useState(Boolean)
  const [hasPrevious, setHasPrevious] = useState(Boolean)
  const [currentPage, setCurrentPage] = useState(0)
  const [containsProduto, setcontainsProduto] = useState(true)
  const [infoBuscaCliente, setInfoBuscaProduto] = useState('');
  const clientePerPage = 5

  useEffectSkipFirst(() => {
    if(currentPage >= 0 && currentPage < totalPage){
      setcontainsProduto(true)
      getProdutos();
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

  const previousPage = async () => {
    if (currentPage <= 0) return

    if (currentPage <= totalPage){
      setCurrentPage(prev => prev -1)
    }

    setcontainsProduto(!!hasPrevious)
  }

  const filtros = [
    { value: 'Todos', label: 'Todos' },
  ]
  

  const handleChange = () =>{

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


  const nextPage = async () => {
    if (currentPage < totalPage){
        setCurrentPage(prev => prev +1)
    }

    setcontainsProduto(!!hasNext)
  }

  const getProdutos = async () => {
    const idOtica = userData?.id_oticas[0]
    const apiUrl = import.meta.env.VITE_API_URL;
    const infoPesquisa = '';
    const filtroPesquisa = ''

    console.log(`${apiUrl}produtos?idOtica=${idOtica}&page=${currentPage}&size=${clientePerPage}`)

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

    console.log(data)

    setTotalProduto(data.totalElements)
    setTotalPage(data.totalPages)
    setHasNext(data.hasNext)
    setHasPrevious(data.hasPrevious)

    const listProdutos = data.content;
    if (!listProdutos.length){
      handleApiResponse( "alert", "Nenhum cliente encontrado!")
      setProdutos([])
      setInfoBuscaProduto('')
      return
    }
    setProdutos(listProdutos)
  }

  return (
    <div className="flex w-full h-auto min-h-screen">
      <Sidebar/>
      <div className="p-4 flex-1">
        <div className="mb-8">
          <div className='flex items-center gap-2'>
            <Box/>
            <h1 className="text-3xl font-bold text-foreground mb-2">Produtos</h1>
          </div>
          <p className="text-muted-foreground">Gerencie seus produtos de forma eficiente</p>
        </div>

        <div className='shadow-md p-3 rounded-lg'>
          <div className='flex items-center gap-2'>
            <Filter/>
            <p>Filtros</p>
          </div>
          <div className='flex w-full space-x-2 mb-6'>
            <Input
              name="nomeFilter"
              placeholder='Buscar por nome...'
              onChange={handleChange}
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Input
              name="skuFilter"
              placeholder='SKU'
              onChange={handleChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Input
              name="marcaFilter"
              placeholder='Marca'
              onChange={handleChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Select
              name="tipoProduto"
              onChange={handleChange}
              options={filtros}
              classNameDiv='flex-1'
              className="w-full p-2"
            />
          </div>
        </div>


        <div className='shadow-md p-5 rounded-lg'>
          <h2 className='text-lg font-bold text-foreground mb-2'>Lista de Produtos</h2>

          <div className='rounded-md border overflow-hidden'>
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="bg-blue-300 border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted/50">
                  <th className="font-semibold h-12 px-4 text-left align-middle text-muted-foreground">Nome</th>
                  <th className="font-semibold h-12 px-4 text-left align-middle text-muted-foreground">SKU</th>
                  <th className="font-semibold h-12 px-4 text-left align-middle text-muted-foreground">Marca</th>
                  <th className="font-semibold h-12 px-4 text-left align-middle text-muted-foreground">Modelo</th>
                  <th className="font-semibold h-12 px-4 text-left align-middle text-muted-foreground">Cor</th>
                  <th className="font-semibold h-12 px-4 text-right align-middle text-muted-foreground">Preço Venda</th>
                  <th className="font-semibold h-12 px-4 text-right align-middle text-muted-foreground">Custo</th>
                  <th className="font-semibold h-12 px-4 text-right align-middle text-muted-foreground">Lucro</th>
                  <th className="font-semibold h-12 px-4 text-left align-middle text-muted-foreground">Status</th>
                  <th className="font-semibold h-12 px-4 text-left align-middle text-muted-foreground">Cadastro</th>
                  <th className="font-semibold h-12 px-4 text-left align-middle text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="text-left">
                {!containsProduto ? (
                  <tr>
                    <td colSpan={11} className="text-center py-4 text-gray-500">
                      Nenhum registro encontrado
                    </td>
                  </tr>
                ) : (
                  produtos.map((produto, index) => (
                    <tr key={index} className=" bg-gray-100 hover:bg-gray-200 transition-colors">
                      <td className="px-4">{produto.nome}</td>
                      <td className="px-4">{produto.sku}</td>
                      <td className="px-4">{produto.marca}</td>
                      <td className="px-4">{produto.modelo}</td>
                      <td className="px-4">{produto.cor}</td>
                      <td className="px-4 text-right">R$ {produto.valorVenda}</td>
                      <td className="px-4 text-right">R$ {produto.custoReposicao}</td>
                      <td className="px-4 text-right">{produto.lucroPercentual}</td>
                      <td className="px-4">{produto.ativo}</td>
                      <td className="px-4">{produto.dataCadastro}</td>
                      <td className="px-4">Ação</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {produtos.length > 0 && (
              <div className='w-full p-3 bg-white-300 gap-2 flex justify-between'>
                  <div className=''>
                    <p>Exibindo {clientePerPage} de {totalCliente}</p>
                  </div>
                  <div className='flex gap-2'>
                    <div className='cursor-pointer' onClick={previousPage}>
                        <p>Anterior</p>
                    </div>
                    <div className='flex gap-2'>
                        {Array.from({ length: totalPage })
                        .slice(Math.floor(currentPage / 3) * 3, Math.floor(currentPage / 3) * 3 + 3)
                        .map((_, index) => {
                          const pageIndex = Math.floor(currentPage / 3) * 3 + index;
                          return (
                          <div
                              key={pageIndex}
                              className={`w-10 text-center cursor-pointer border border-gray-300 hover:border-blue-300 hover:shadow-md flex justify-center items-center
                              ${currentPage === pageIndex ? 'bg-blue-200' : 'bg-white'}
                              `}
                              onClick={() => setCurrentPage(pageIndex)}
                          >
                              <p>{pageIndex + 1}</p>
                          </div>
                          );
                        })}
                    </div>
                    <div className='cursor-pointer' onClick={nextPage}>
                        <p>Próximo</p>
                    </div>
                  </div>
              </div>
            )}
            {/* <div className=' p-3 flex justify-end'>
              <button 
                className='bg-blue-600 text-white p-2 w-28 rounded-md'
                onClick={getProdutos}
              >
                Buscar
              </button>
            </div> */}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Produtos