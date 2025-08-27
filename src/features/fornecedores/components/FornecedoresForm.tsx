import React from 'react';
import { FornecedoresFormProps } from '../types/fornecedores';
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Users, MapIcon } from 'lucide-react';


export const FornecedoresForm: React.FC<FornecedoresFormProps> = ({
  formData,
  cnpjError,
  emailError,
  telefoneError,
  onSubmit,
  onInputChange,
  onBlurCEP,
  onBlurCNPJ, 
  buttonText,
  disabled = false,
  abaAtiva
}) => {
  return (
    <form onSubmit={onSubmit} className="h-screen">

      {abaAtiva == "endereços" && (
        <div className="border-t shadow-md p-5 rounded-lg">
          <div className='my-8 flex gap-2 '>
            <MapIcon className="text-blue" />
            <h2 className='text-lg font-medium text-gray-900 mb-2'>Endereço</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select
              label="Situação *"
              name="ativo"
              value={formData.ativo ? 'active' : 'inactive'}
              onChange={(e) => {
                const value = e.target.value === 'active';
                const event = {
                  ...e,
                  target: {
                    ...e.target,
                    value,
                  },
                } as unknown as React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

                onInputChange(event);
              }}
              options={[
                { value: 'active', label: 'Ativo' },
                { value: 'inactive', label: 'Inativo' },
              ]}
            />
            <Input
              label="Logradouro *"
              name="enderecoLogradouro"
              value={formData.enderecoLogradouro}
              onChange={onInputChange}
            />
            <Input
              label="CEP *"
              name="enderecoCep"
              value={formData.enderecoCep}
              onChange={onInputChange}
              onBlur={onBlurCEP}
              maxLength={9}
            />
            <Input
              label="Número *"
              name="enderecoNumero"
              value={formData.enderecoNumero}
              onChange={onInputChange}
            />
            <Input
              label="Complemento"
              name="enderecoComplemento"
              value={formData.enderecoComplemento}
              onChange={onInputChange}
            />
            <Input
              label="Bairro *"
              name="enderecoBairro"
              value={formData.enderecoBairro}
              onChange={onInputChange}
            />
            <Input
              label="Cidade *"
              name="enderecoCidade"
              value={formData.enderecoCidade}
              onChange={onInputChange}
            />
            <Input
              label="Estado *"
              name="enderecoEstado"
              value={formData.enderecoEstado}
              onChange={onInputChange}
            />
          </div>
        </div>
      )}

      {abaAtiva == "pessoais" && (
        <div className=''>
          <div className='shadow-md p-5 rounded-lg'>
            <div className='my-8 flex gap-2 '>
              <Users className="text-blue" />
              <h2 className='text-lg font-medium text-gray-900 mb-2'>Dados pessoais</h2>
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <Input
                label="Razão Social *"
                name="razaoSocial"
                value={formData.razaoSocial}
                onChange={onInputChange}
                required
              />
              <Input
                label="Nome Fantasia"
                name="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={onInputChange}
              />
              <Input
                label="Inscrição Estadual"
                name="inscricaoEstadual"
                value={formData.inscricaoEstadual}
                onChange={onInputChange}
              />
              <Input
                label="CNPJ *"
                name="cnpj"
                value={formData.cnpj}
                onBlur={onBlurCNPJ}
                onChange={onInputChange}
                error={cnpjError}
                maxLength={18}
                required
                disabled={disabled}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                error={emailError}
                onChange={onInputChange}
              />
              <Input
                label="Telefone *"
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={onInputChange}
                maxLength={16}
                error={telefoneError}
              />
              <Input
                label="Prazo Pagamento *"
                name="prazoPagamento"
                value={formData.prazoPagamento}
                onChange={onInputChange}
              />
            </div>

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
