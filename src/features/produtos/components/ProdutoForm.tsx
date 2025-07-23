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
  infosAdicionais,
  tributacao 
}) => {



  
  return (
    <form onSubmit={onSubmit} className="shadow-md p-5 rounded-lg">
      {infosAdicionais ? (
        <div className='border-t'>
          <h2 className="text-xl my-5 text-primary">Informações Gerais</h2>
          
          <div className="grid grid-cols-3 gap-2">
            <Select
              label="Unidade do Produto *"
              name="unidade"
              value={formData.unidade}
              onChange={onInputChange}
              options={infos_unidade_produto}
              disabled={disabled}
            />
            <Select
              label="Situação *"
              name="ativo"
              value={formData.ativo ? 'active' : 'inactive'}
              onChange={(e) => {
                const isActive = e.target.value === 'active';
                onInputChange({ target: { name: 'ativo', value: isActive } });
              }}
              options={infos_situacao}
            />
            
          </div>

          <div className='grid grid-cols-2 gap-2 my-5'>
            

            <Input
              label="codigo de Barras *"
              name="codigoBarras"
              value={formData.codigoBarras}
              onChange={onInputChange}
            />
            <Input
              label="ncm *"
              name="ncm"
              value={formData.ncm}
              onChange={onInputChange}
            />
            <Input
              label="cest *"
              name="cest"
              value={formData.cest}
              onChange={onInputChange}
            />
            <Input
              label="cfop *"
              name="cfop"
              value={formData.cfop}
              onChange={onInputChange}
              required
            />
              <Input
              label="Custo Reposicao *"
              name="custoReposicao"
              value={formData.custoReposicao}
              onChange={onInputChange}
              required
            />
            <Input
              label="Lucro Percentual *"
              name="lucroPercentual"
              value={formData.lucroPercentual}
              onChange={onInputChange}
              required
            />
            <Input
              label="Valor Venda"
              name="valorVenda"
              value={formData.valorVenda}
              onChange={onInputChange}
            />
            <Input
              label="Material *"
              name="material"
              value={formData.material}
              onChange={onInputChange}
            />

          </div>

         
        </div>
      ): (
        <div className=''>
          <h2 className="text-xl my-5 text-primary">Informações Gerais</h2>

          <div className=''>
            <div className="grid grid-cols-3 gap-2">
              <Select
                label="Tipo de Produto *"
                name="tipoProduto"
                value={formData.tipoProduto}
                onChange={onInputChange}
                options={infos_tipo_produto}
                disabled={disabled}
              />
              <Select
                label="Gênero de Produto *"
                name="genero"
                value={formData.genero}
                onChange={onInputChange}
                options={infos_genero_produto}
                disabled={disabled}
              />
              <Select
                label="Origem do Produto *"
                name="origem"
                value={formData.origem}
                onChange={onInputChange}
                options={infos_origem_produto}
                disabled={disabled}
              />
            </div>

            <div className='grid grid-cols-2 gap-2 my-5'>
              <Input
                label="Descricao *"
                name="descricao"
                value={formData.descricao}
                onChange={onInputChange}
                required
              />
              <Input
                label="Nome *"
                name="nome"
                value={formData.nome}
                onChange={onInputChange}
                required
              />
              <Input
                label="Marca *"
                name="marca"
                value={formData.marca}
                onChange={onInputChange}
                required
              />
              <Input
                label="Modelo *"
                name="modelo"
                value={formData.modelo}
                onChange={onInputChange}
                required
              />
              <Input
                label="Cor"
                name="cor"
                value={formData.cor}
                onChange={onInputChange}
                required
              />
              <Input
                label="sku *"
                name="sku"
                value={formData.sku}
                onChange={onInputChange}
                required
                disabled={disabled}
              />

              <Input
                label="icms Aliquota *"
                name="icmsAliquota"
                value={formData.icmsAliquota}
                onChange={onInputChange}
                required
                disabled={disabled}
              />

              <Input
                label="pis Aliquota *"
                name="pisAliquota"
                value={formData.pisAliquota}
                onChange={onInputChange}
                required
                disabled={disabled}
              />

              <Input
                label="cofins Aliquota *"
                name="cofinsAliquota"
                value={formData.cofinsAliquota}
                onChange={onInputChange}
                required
                disabled={disabled}
              />

              <Input
                label="ipi Aliquota *"
                name="ipiAliquota"
                value={formData.ipiAliquota}
                onChange={onInputChange}
                required
                disabled={disabled}
              />

              {tributacao && (
                <>
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 ">Cofins Situacao Tributaria</label>
                    <select
                      className="my-3 block w-5/6 border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={onInputChange}
                      name="tributacao.cofinsSituacaoTributaria.codigo"
                    >
                      {tributacao.cofinsSituacaoTributaria.map((option: Option) => (
                        <option key={option.codigo} value={option.codigo}>
                          {option.descricao}
                        </option>
                      ))} 
                    </select> 
                  </div>

                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 ">icms Situacao Tributaria</label>
                    <select
                      className="my-3 block w-5/6 border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={onInputChange}
                      name="tributacao.icmsSituacaoTributaria.codigo"
                    >
                      {tributacao.icmsSituacaoTributaria.map((option: Option) => (
                        <option key={option.codigo} value={option.codigo}>
                          {option.descricao}
                        </option>
                      ))} 
                    </select> 
                  </div>

                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 ">ipi Situacao Tributaria</label>
                    <select
                      className="my-3 block w-5/6 border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={onInputChange}
                      name="tributacao.ipiSituacaoTributaria.codigo"
                    >
                      {tributacao.ipiSituacaoTributaria.map((option: Option) => (
                        <option key={option.codigo} value={option.codigo}>
                          {option.descricao}
                        </option>
                      ))} 
                    </select> 
                  </div>

                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 ">pis Situacao Tributaria</label>
                    <select
                      className="my-3 block w-5/6 border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={onInputChange}
                      name="tributacao.pisSituacaoTributaria.codigo"
                    >
                      {tributacao.pisSituacaoTributaria.map((option: Option) => (
                        <option key={option.codigo} value={option.codigo}>
                          {option.descricao}
                        </option>
                      ))} 
                    </select> 
                  </div>

                  
                </>
              )}

              <div>
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
        </div>
      )}
        


      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
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
