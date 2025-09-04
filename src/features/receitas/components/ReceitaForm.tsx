import { receitaFormProps } from '../types/receita';
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { 
  infos_tipo_produto, 
  infos_genero_produto, 
  infos_origem_produto, 
  infos_unidade_produto,
  infos_situacao
} from '../services/infosReceitas';
import { div } from 'framer-motion/client';

type Option = { 
  codigo: string;
  descricao: string;
};

export const ReceitaForm: React.FC<receitaFormProps> = ({
  formData,
  onSubmit,
  onInputChange,
  buttonText,
  disabled = false,
  abaAtiva,
  tributacao
}) => {


  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 p-3 rounded-lg">
      <div className="border-t bg-white shadow-md p-5 rounded-lg">
        <h2 className='text-2xl py-3 font-bold text-foreground '>Informações Gerais</h2>

        <div className="flex space-x-2 mb-3">
          <Select
            label="Cliente *"
            name="tipoProduto"
            value={formData.ncm}
            onChange={onInputChange}
            options={infos_tipo_produto}
            disabled={disabled}
            classNameDiv='flex-1'
            className="w-full p-2"
          />

          <Input
            label="Médico Oftalmologista"
            name="cor"
            placeholder='Nome do médico'
            value={formData.cor}
            onChange={onInputChange}
            required
            className='flex-1 w-full'
            classNameDiv='flex-1'
          />
          
        </div>

        <div className="flex space-x-2 mb-6">
          <Input
            label="Data da Receita"
            type='date'
            name="cor"
            value={formData.cor}
            onChange={onInputChange}
            required
            className='flex-1 w-full'
            classNameDiv='flex-1'
          />

          <Input
            label="Validade da Receita"
            type='date'
            name="cor"
            value={formData.cor}
            onChange={onInputChange}
            required
            className='flex-1 w-full'
            classNameDiv='flex-1'
          />
        </div>
      </div>

      <div className="border-t bg-white shadow-md p-5 rounded-lg">
        <h2 className='text-2xl py-3 font-bold text-foreground mb-2'>Grau das Lentes</h2>
        <div>
          <p className='text-2x1 text-purple-500 font-bold'>Olho Direito (OD)</p>
          <div className="flex space-x-2 my-5">
            <Input
              label="Ésferico"
              placeholder='EX: -2.50'
              name="cor"
              value={formData.cor}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Input
              label="Cilíndrico"
              placeholder='EX: -1.00'
              name="cor"
              value={formData.cor}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Input
              label="Eixo"
              placeholder='EX: 90'
              name="cor"
              value={formData.cor}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Input
              label="Adição"
              placeholder='EX: +2.00'
              name="cor"
              value={formData.cor}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
          </div>
        </div>

        <div>
          <p className='text-2x1 text-purple-500 font-bold'>Olho Esquerdo (OE)</p>
          <div className="flex space-x-2 my-5">
            <Input
              label="Ésferico"
              placeholder='EX: -2.50'
              name="cor"
              value={formData.cor}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Input
              label="Cilíndrico"
              placeholder='EX: -1.00'
              name="cor"
              value={formData.cor}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Input
              label="Eixo"
              placeholder='EX: 90'
              name="cor"
              value={formData.cor}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
            <Input
              label="Adição"
              placeholder='EX: +2.00'
              name="cor"
              value={formData.cor}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
          </div>
          
        </div>
        

        <div>
          <p className='text-2x1 text-purple-500 font-bold'>Informações Adicionais</p>
          <div className="flex space-x-2 my-5">
            <Input
              label="Distância Pupilar (DP)"
              placeholder='EX: +2.00'
              name="cor"
              value={formData.cor}
              onChange={onInputChange}
              required
              className='flex-1 w-full'
              classNameDiv='flex-1'
            />
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea
          name="observacoes"
          placeholder='Observações adicionais sobre a receita'
          value={formData.observacoes}
          onChange={onInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>


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
