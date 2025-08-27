import React from 'react';
import { ClientFormProps } from '../types/client';
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { infos_metodos_pagamentos } from '../../../services/infosClientes';
import { Users, Landmark, MapIcon } from 'lucide-react';

const METODOS_PAGAMENTO = infos_metodos_pagamentos;

export const ClientForm: React.FC<ClientFormProps> = ({
  formData,
  documentoError,
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
      {abaAtiva == "endereço" && (
        <div className="border-t shadow-md p-5 rounded-lg">
          <div className='my-8 flex gap-2 '>
            <MapIcon className="text-blue" />
            <h2 className='text-lg font-medium text-gray-900 mb-2'>Endereço</h2>
          </div>
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
              onChange={onInputChange}
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
      )}

      {abaAtiva == "pessoais" && (
        <div className=''>
          <div className='shadow-md p-5 rounded-lg'>
            <div className='my-8 flex gap-2 '>
              <Users className="text-blue" />
              <h2 className='text-lg font-medium text-gray-900 mb-2'>Dados pessoais</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 ">
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
                    value={formData.documento}
                    onChange={onInputChange}
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
                      value={formData.documento}
                      onBlur={onBlurCNPJ}
                      onChange={onInputChange}
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
                onChange={onInputChange}
                error={emailError}
                required
              />
              <Input
                label="Telefone *"
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={onInputChange}
                maxLength={15}
                error={telefoneError}
                required
              />
            </div>
          </div>



          <div className='shadow-md p-5 mt-5 rounded-lg'>
            <div className='my-8 flex gap-2 '>
              <Landmark className="text-blue" />
              <h2 className='text-lg font-medium text-gray-900 mb-2'>Dados Bancários</h2>
            </div>
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
