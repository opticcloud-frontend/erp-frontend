import { produtoFormProps } from '../types/produto';
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { 
  infos_tipo_produto, 
  infos_genero_produto, 
  infos_origem_produto, 
  infos_unidade_produto,
  infos_situacao
} from '../services/infosProdutos';
import { div } from 'framer-motion/client';

type Option = { 
  codigo: string;
  descricao: string;
};

export const ProdutoForm: React.FC<produtoFormProps> = ({
  formData,
  onSubmit,
  onInputChange,
  buttonText,
  disabled = false,
  abaAtiva,
  tributacao
}) => {


  return (
    <form onSubmit={onSubmit} className=" p-5 rounded-lg">
      {abaAtiva == "basicos" && (
        <div className=''>
          <h2 className="text-xl my-5 text-primary bg-blue-100 p-4 text-blue-900 font-bold rounded">Informações do Produto</h2>
    
          <div className=''>
            <div className="flex w-full space-x-2 mb-6">
              <Input
                label="CODIGO DE BARRAS *"
                name="codigoBarras"
                value={formData.codigoBarras}
                onChange={onInputChange}
                className='flex-1 w-full'
                classNameDiv='flex-1'
              />
              <Input
                label="NOME DO PRODUTO *"
                name="nome"
                value={formData.nome}
                onChange={onInputChange}
                required
                className='flex-1 w-full'
                classNameDiv='flex-1'
              />
            </div>

            <Input
              label="DESCRIÇÃO *"
              name="descricao"
              className="w-full h-20"
              placeholder='Descrição detalhada do produto'
              value={formData.descricao}
              onChange={onInputChange}
              required
            />

            <div className="flex  space-x-2 mb-6 ">
              <Input
                label="MARCA *"
                name="marca"
                value={formData.marca}
                onChange={onInputChange}
                required
                className=''
                classNameDiv='flex-1'
              />

              <Input
                label="MODELO *"
                name="modelo"
                value={formData.modelo}
                onChange={onInputChange}
                required
                classNameDiv='flex-1 w-full'
              />

              <Input
                label="SKU *"
                name="sku"
                value={formData.sku}
                onChange={onInputChange}
                required
                disabled={disabled}
                classNameDiv='flex-1 w-full'
              />

              <Input
                label="COR"
                name="cor"
                value={formData.cor}
                onChange={onInputChange}
                required
                className='flex-1 w-full'
                classNameDiv='flex-1'
              />
            </div>



            <div className="flex space-x-2 mb-6">
              <Select
                label="TIPO DO PRODUTO *"
                name="tipoProduto"
                value={formData.tipoProduto}
                onChange={onInputChange}
                options={infos_tipo_produto}
                disabled={disabled}
                classNameDiv='flex-1'
                className="w-full p-2"
              />

              <Select
                label="GÊNERO DO PRODUTO *"
                name="genero"
                value={formData.genero}
                onChange={onInputChange}
                options={infos_genero_produto}
                disabled={disabled}
                classNameDiv='flex-1'
                className="w-full p-2"
              />
              
              <Select
                label="ORIGEM DO PRODUTO *"
                name="origem"
                value={formData.origem}
                onChange={onInputChange}
                options={infos_origem_produto}
                disabled={disabled}
                classNameDiv='flex-1'
                className="w-full p-2"
              />
            </div>
    

            <div className=' '>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={onInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
    
          </div>
        </div>
      )}


      {abaAtiva == "financeiro" && (
        <div className=''>
          <h2 className="text-xl my-5 text-primary bg-blue-100 p-4 text-cyan-500 font-bold rounded">Informações Financeiras</h2>
          
          <div className="flex w-full space-x-2 mb-6">
            <Select
              label="UNIDADE DO PRODUTO *"
              name="unidade"
              value={formData.unidade}
              onChange={onInputChange}
              options={infos_unidade_produto}
              disabled={disabled}
              classNameDiv='flex-1'
              className="w-full p-2"
            />
            <Select
              label="SITUAÇÃO *"
              name="ativo"
              value={formData.ativo ? 'active' : 'inactive'}
              onChange={(e) => {
                const isActive = e.target.value === 'active';
                onInputChange({ target: { name: 'ativo', value: isActive } });
              }}
              options={infos_situacao}
              classNameDiv='flex-1'
              className="w-full p-2"
            />
          </div>

          <div className='flex w-full space-x-2 mb-6'>
            <Input
              label="CUSTO REPOSIÇÃO *"
              name="custoReposicao"
              value={formData.custoReposicao}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Input
              label="LUCRO PERCENTUAL *"
              name="lucroPercentual"
              value={formData.lucroPercentual}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Input
              label="VALOR VENDA"
              name="valorVenda"
              value={formData.valorVenda}
              onChange={onInputChange}
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />

          </div>

          <Input
            label="MATERIAL *"
            name="material"
            value={formData.material}
            onChange={onInputChange}
          />
          
        </div>
      )}



      {abaAtiva == "tributarias" && (
        <div>
          <h2 className="text-xl my-5 text-primary bg-yellow-100 p-4 text-yellow-600 font-bold rounded">Dados de Tributação</h2>

          <div className="flex w-full space-x-2 mb-6 ">
            <Input
              label="NCM *"
              name="ncm"
              value={formData.ncm}
              onChange={onInputChange}
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />

            <Input
              label="CEST *"
              name="cest"
              value={formData.cest}
              onChange={onInputChange}
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />

            <Input
              label="CFOP *"
              name="cfop"
              value={formData.cfop}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
          </div>

          <div>
            <h3 className=' my-5 text-primary font-bold rounded'>Alíquotas Tributárias</h3>

            <div className="flex w-full space-x-2 mb-6 ">
              <Input
                label="ICMS *"
                name="tributacao.icmsAliquota"
                value={formData.tributacao.icmsAliquota}
                onChange={onInputChange}
                required
                disabled={disabled}
                className='flex-1 w-full'
                classNameDiv='flex-1'
              />

              <Input
                label="pis *"
                name="tributacao.pisAliquota"
                value={formData.tributacao.pisAliquota}
                onChange={onInputChange}
                required
                disabled={disabled}
                className='flex-1 w-full'
                classNameDiv='flex-1'
              />

              <Input
                label="COFINS *"
                name="tributacao.cofinsAliquota"
                value={formData.tributacao.cofinsAliquota}
                onChange={onInputChange}
                required
                disabled={disabled}
                className='flex-1 w-full'
                classNameDiv='flex-1'
              />

              <Input
                label="IPI *"
                name="tributacao.ipiAliquota"
                value={formData.tributacao.ipiAliquota}
                onChange={onInputChange}
                required
                disabled={disabled}
                className='flex-1 w-full'
                classNameDiv='flex-1'
              />
            </div>
          </div>



          {tributacao && (
            <>
              <div className="flex w-full space-x-2 mb-6 gap-5">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 ">ICMS - CST</label>
                  <select
                    className="my-3 block p-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={onInputChange}
                    name="tributacao.icmsSituacaoTributaria.codigo"
                    value={formData.tributacao.icmsSituacaoTributaria?.codigo ?? ""}
                  >
                    <option value="" >Selecione uma opção</option>
                    {tributacao.icmsSituacaoTributaria.map((option: Option) => (
                      <option key={option.codigo} value={option.codigo}>
                        {option.descricao}
                      </option>
                    ))} 
                  </select> 
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 ">PIS - CST</label>
                  <select
                    className="my-3 block p-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={onInputChange}
                    name="tributacao.pisSituacaoTributaria.codigo"
                    value={formData.tributacao.pisSituacaoTributaria?.codigo ?? ""}
                  >
                    <option value="" >Selecione uma opção</option>
                    {tributacao.pisSituacaoTributaria.map((option: Option) => (
                      <option key={option.codigo} value={option.codigo}>
                        {option.descricao}
                      </option>
                    ))} 
                  </select> 
                </div>
              </div>

              <div className="flex w-full space-x-2 mb-6  gap-5">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 ">COFINS - CST </label>
                  <select
                    className="my-3 block p-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={onInputChange}
                    name="tributacao.cofinsSituacaoTributaria.codigo"
                    value={formData.tributacao.cofinsSituacaoTributaria?.codigo ?? ""}
                  >
                    <option value="" >Selecione uma opção</option>
                    {tributacao.cofinsSituacaoTributaria.map((option: Option) => (
                      <option key={option.codigo} value={option.codigo}>
                        {option.descricao}
                      </option>
                    ))} 
                  </select> 
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 ">IPI - CST</label>
                  <select
                    className="my-3 block p-2 w-full border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={onInputChange}
                    name="tributacao.ipiSituacaoTributaria.codigo"
                    value={formData?.tributacao?.ipiSituacaoTributaria?.codigo ?? ""}
                  >
                    <option value="" >Selecione uma opção</option>
                    {tributacao.ipiSituacaoTributaria.map((option: Option) => (
                      <option key={option.codigo} value={option.codigo}>
                        {option.descricao}
                      </option>
                    ))} 
                  </select> 
                </div>
              </div>
            </>
              )}
        </div>
      )}
        


      <div className="flex justify-end space-x-3 pt-4">

        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};
