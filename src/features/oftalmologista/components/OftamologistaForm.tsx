import React from 'react';
import { OftalmologistaFormProps } from '../types/oftamologista';
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Users } from 'lucide-react';


export const OftamologistaForm: React.FC<OftalmologistaFormProps> = ({
  formData,
  emailError,
  telefoneError,
  onSubmit,
  onInputChange,
  buttonText,
  disabled = false,
}) => {
  return (
    <form onSubmit={onSubmit} className="h-screen">

      <div className=''>
        <div className='shadow-md p-5 rounded-lg'>
          <div className='my-8 flex gap-2 '>
            <Users className="text-blue" />
            <h2 className='text-lg font-medium text-gray-900 mb-2'>Dados pessoais</h2>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <Input
              label="Nome Completo *"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={onInputChange}
              required
            />
            <Select
              label="Status *"
              name="status"
              value={formData.status ? "active" : "inactive"}
              onChange={(e) => {
                onInputChange({
                  target: {
                    name: "status",
                    value: e.target.value === "active",
                  },
                } as any);
              }}
              options={[
                { value: "active", label: "Ativo" },
                { value: "inactive", label: "Inativo" },
              ]}
            />
            
            <Input
              label="CRM"
              name="crm"
              value={formData.crm}
              onChange={onInputChange}
            />
            <Input
              label="Especialidade"
              name="especialidade"
              value={formData.especialidade}
              onChange={onInputChange}
            />
            
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Telefone *"
              type="telefone"
              name="telefone"
              value={formData.telefone}
              error={telefoneError}
              maxLength={16}
              onChange={onInputChange}
            />
            <Input
              label="email *"
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              error={emailError}
            />
            <Input
              label="Clinica Hospital *"
              name="clinicaHospital"
              value={formData.clinicaHospital}
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
