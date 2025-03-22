import { ClientFormProps } from './client'


export const ClientForm: React.FC<ClientFormProps> = ({
  formData,
  documentoError,
  emailError,
  telefoneError,
  displayDocumento,
  METODOS_PAGAMENTO,
  onSubmit,
  onInputChange,
  onBlurCEP,
  onBlurCNPJ, 
  buttonText,
}) => {
  {console.log(formData)}
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label
            htmlFor="tipoCliente"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de Cliente *
          </label> 
          <select
            id="tipoCliente"
            name="tipoCliente"
            value={formData.tipoCliente}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="PESSOA_FISICA">Pessoa Física</option>
            <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Situação *
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            id="ativo"
            name="ativo"
            value={formData.ativo ? 'active' : 'inactive'}
            onChange={(e) =>
              onInputChange({
                target: {
                  name: 'ativo',
                  value: e.target.value === 'active',
                },
              } as any)
            }
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>

        {formData.tipoCliente === 'PESSOA_FISICA' ? (
          <>
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome *
              </label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={formData.nome}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="documento"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CPF *
              </label>
              <input
                type="text"
                name="documento"
                id="documento"
                value={displayDocumento}
                onChange={onInputChange}
                maxLength={14}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  documentoError ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {documentoError && (
                <p className="mt-1 text-sm text-red-600">{documentoError}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <label
                htmlFor="razaoSocial"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Razão Social *
              </label>
              <input
                type="text"
                name="razaoSocial"
                id="razaoSocial"
                value={formData.razaoSocial}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="documento"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CNPJ *
              </label>
              <input
                type="text"
                name="documento"
                id="documento"
                value={displayDocumento}
                onBlur={onBlurCNPJ}
                onChange={onInputChange}
                maxLength={18}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="nomeFantasia"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome Fantasia
              </label>
              <input
                type="text"
                name="nomeFantasia"
                id="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="responsavelLegal"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Responsável Legal
              </label>
              <input
                type="text"
                name="responsavelLegal"
                id="responsavelLegal"
                value={formData.responsavelLegal}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="inscricaoEstadual"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Inscrição Estadual 
              </label>
              <input
                type="text"
                name="inscricaoEstadual"
                id="inscricaoEstadual"
                value={formData.inscricaoEstadual}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {formData.tipoCliente === 'PESSOA_FISICA' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento *
            </label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={onInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="emailCliente"
            value={formData.emailCliente}
            onChange={onInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              emailError ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone *
          </label>
          <input
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={onInputChange}
            maxLength={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          {telefoneError && (
            <p className="mt-1 text-sm text-red-600">{telefoneError}</p>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logradouro *
            </label>
            <input
              type="text"
              name="enderecoLogradouro"
              value={formData.enderecoLogradouro}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CEP *
            </label>
            <input
              type="text"
              name="enderecoCep"
              value={formData.enderecoCep}
              onChange={onInputChange}
              onBlur={onBlurCEP}
              maxLength={9}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número *
            </label>
            <input
              type="text"
              name="enderecoNumero"
              value={formData.enderecoNumero}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complemento
            </label>
            <input
              type="text"
              name="enderecoComplemento"
              value={formData.enderecoComplemento}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro *
            </label>
            <input
              type="text"
              name="enderecoBairro"
              value={formData.enderecoBairro}
              onChange={onInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade *
            </label>
            <input
              type="text"
              name="enderecoCidade"
              value={formData.enderecoCidade}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado *
            </label>
            <input
              type="text"
              name="enderecoEstado"
              value={formData.enderecoEstado}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Método de Pagamento Preferido *
          </label>
          <select
            name="metodoPagamentoPreferido"
            value={formData.metodoPagamentoPreferido}
            onChange={onInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {METODOS_PAGAMENTO.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Limite de Crédito
          </label>
          <input
            type="text"
            name="limiteCredito"
            value={formData.limiteCredito}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          name="observacoes"
          value={formData.observacoes}
          onChange={onInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-6">
         
        
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