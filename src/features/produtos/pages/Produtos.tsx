import { useState } from 'react';
import {Sidebar} from '../../../components/layout/Sidebar'
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { useAuth } from '../../../contexts/AuthContext';

type PopupType = 'success' | 'error' | 'alert' | null;
interface PopupState {
  type: PopupType;
  title: string;
  message: string;
  isOpen: boolean;
}

const dadosClientes: Cliente[] = [];


export function Produtos() {
  const { userData, setClienteData} = useAuth(); 
  const [totalCliente, setTotalCliente] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [hasNext, setHasNext] = useState(Boolean)
  const [hasPrevious, setHasPrevious] = useState(Boolean)
  const [currentPage, setCurrentPage] = useState(0)
  const [containsProduto, setcontainsProduto] = useState(true)

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

  const getProdutos = async () => {
    const idOtica = userData?.id_oticas[0]
    const apiUrl = import.meta.env.VITE_API_URL;
    const infoPesquisa = '';
    const filtroPesquisa = ''


    const response = await fetch(`${apiUrl}produtos?idOtica=${idOtica}&${filtroPesquisa}=${infoPesquisa}&page=${0}&size=${0}` , {
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

    setTotalCliente(data.totalElements)
    setTotalPage(data.totalPages)
    setHasNext(data.hasNext)
    setHasPrevious(data.hasPrevious)

    const listClientes = data.content;
    if (!listClientes.length){
        handleApiResponse( "alert", "Nenhum cliente encontrado!")
        setClientes([])
        setInfoBuscaCliente('')
        return
    }
    setClientes(listClientes)
  }

  return (
    <div className="flex w-full h-auto min-h-screen">
      <Sidebar/>
      <div className="p-4 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seus produtos de forma eficiente</p>
        </div>

        <div className='shadow-md p-3 rounded-lg'>
          <div>
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
            <table className='w-full caption-bottom text-sm'>
              <thead className=''>
                <tr className='bg-red-200 border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted/50'>
                  <th className='font-semibold h-12 px-4 text-left align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0'>Nome</th>
                  <th className='font-semibold h-12 px-4 text-left align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0'>SKU</th>
                  <th className='font-semibold h-12 px-4 text-left align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0'>Marca</th>
                  <th className='font-semibold h-12 px-4 text-left align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0'>Modelo</th>
                  <th className='font-semibold h-12 px-4 text-left align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0'>Cor</th>
                  <th className='font-semibold h-12 px-4 align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right'>Preço Venda</th>
                  <th className='font-semibold h-12 px-4 align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right'>Custo</th>
                  <th className='font-semibold h-12 px-4 align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right'>Lucro</th>
                  <th className='font-semibold h-12 px-4 text-left align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0'>Status</th>
                  <th className='font-semibold h-12 px-4 text-left align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0'>Cadastro</th>
                  <th className='font-semibold h-12 px-4 text-left align-middle  text-muted-foreground [&:has([role=checkbox])]:pr-0'>Ações</th>
                </tr>
              </thead>
              <tbody className='text-left '>
                <tr>
                  <td className='px-4'>Teste</td>
                  <td className='px-4'>Teste</td>
                  <td className='px-4'>Teste</td>
                  <td className='px-4'>Teste</td>
                  <td className='px-4'>Teste</td>
                  <td className='px-4'>Teste</td>
                  <td className='px-4'>Teste</td>
                  <td className='px-4'>Teste</td>
                  <td className='px-4'>Teste</td>
                  <td className='px-4'>Teste</td>
                  <td className='px-4'>Teste</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Produtos