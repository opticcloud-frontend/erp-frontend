import React from 'react';
import { ClientFormProps } from '../types/client';
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

export const ClientForm: React.FC<ClientFormProps> = ({
  formData,
  documentoError,
  emailError,
  telefoneError,
  displayDocumento,
  METODOS_PAGAMENTO,
  onSubmit,
  onInputChange,
  onInputChangeDocumento,
  onInputChangeEmailCliente,
  onInputChangeTelefone,
  onInputChangeEnderecoCep,
  onBlurCEP,
  onBlurCNPJ,
  buttonText,
  disabled = false,
  infosAdicionais
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3 my-10">
      {infosAdicionais ? (
        <div className='h-[700px]'>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Método de Pagamento Preferido *"
              name="metodoPagamentoPreferido"
              value={formData.metodoPagamentoPreferido}
              onChange={onInputChange}
              options={METODOS_PAGAMENTO}
            />
            <Input
              label="Limite de Crédito"
              name="limiteCredito"
              value={formData.limiteCredito}
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
      ): (
        <div className='h-[700px]'>
          <div className="grid grid-cols-2 gap-2">
            <Select
              label="Tipo de Cliente *"
              name="descricaoTipoCliente"
              value={formData.descricaoTipoCliente}
              onChange={onInputChange}
              options={[
                { value: 'PESSOA_FISICA', label: 'Pessoa Física' },
                { value: 'PESSOA_JURIDICA', label: 'Pessoa Jurídica' },
              ]}
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
              options={[
                { value: 'active', label: 'Ativo' },
                { value: 'inactive', label: 'Inativo'},
              ]}
              disabled={disabled}
            />

            
          </div>

          <div className='grid grid-cols-2 gap-2'>
          {formData.descricaoTipoCliente === 'PESSOA_FISICA' ? (
              <>
                <Input
                  label="Nome *"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={onInputChange}
                  required
                />
                <Input
                  label="CPF *"
                  name="documento"
                  value={displayDocumento}
                  onChange={onInputChangeDocumento}
                  maxLength={14}
                  error={documentoError}
                  required
                  disabled={disabled}
                />
              </>
            ) : (
              <>
                <Input
                  label="Razão Social *"
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={onInputChange}
                  required
                />
                <Input
                  label="CNPJ *"
                  name="documento"
                  value={displayDocumento}
                  onBlur={onBlurCNPJ}
                  onChange={onInputChangeDocumento}
                  maxLength={18}
                  required
                  disabled={disabled}
                />
                <Input
                  label="Nome Fantasia"
                  name="nomeFantasia"
                  value={formData.nomeFantasia}
                  onChange={onInputChange}
                />
                <Input
                  label="Responsável Legal"
                  name="responsavelLegal"
                  value={formData.responsavelLegal}
                  onChange={onInputChange}
                />
                <Input
                  label="Inscrição Estadual"
                  name="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={onInputChange}
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {formData.descricaoTipoCliente === 'PESSOA_FISICA' && (
              <Input
                label="Data de Nascimento *"
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={onInputChange}
                required
              />
            )}
            <Input
              label="Email *"
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChangeEmailCliente}
              error={emailError}
              required
            />
            <Input
              label="Telefone *"
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={onInputChangeTelefone}
              maxLength={15}
              error={telefoneError}
              required
            />
          </div>

          <div className="border-t pt-2">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Endereço</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Logradouro *"
                name="enderecoLogradouro"
                value={formData.enderecoLogradouro}
                onChange={onInputChange}
                required
              />
              <Input
                label="CEP *"
                name="enderecoCep"
                value={formData.enderecoCep}
                onChange={onInputChangeEnderecoCep}
                onBlur={onBlurCEP}
                maxLength={9}
                required
              />
              <Input
                label="Número *"
                name="enderecoNumero"
                value={formData.enderecoNumero}
                onChange={onInputChange}
                required
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
                required
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
