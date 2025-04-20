import type { Cliente } from '../types/types';

export interface ClientFormData {
  descricaoTipoCliente: string;
  ativo: boolean;
  nomeCompleto: string;
  razaoSocial: string;
  nomeFantasia: string;
  responsavelLegal: string;
  inscricaoEstadual: string;
  documento: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  enderecoLogradouro: string;
  enderecoCep: string;
  enderecoNumero: string;
  enderecoComplemento: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoEstado: string;
  metodoPagamentoPreferido: string;
  limiteCredito: string;
  observacoes: string;
  emailUsuarioCadastro: string;
  oticaId: string;
}

export interface ClientEditProps {
  formData: ClientFormData;
  documentoError?: string;
  emailError?: string;
  telefoneError?: string;
  displayDocumento: string;
  clientes: Cliente[];
  disabled?: boolean;
  infosAdicionais?: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleClickBack: (e: React.FormEvent) => void;
  handleClickInfosGerais: (e: React.FormEvent) => void;
  handleClickInfosAdicionais: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleInputChangeDocumento: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChangeEmailCliente: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChangeTelefone: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChangeEnderecoCep: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlurCEP: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleBlurCNPJ: (e: React.FocusEvent<HTMLInputElement>) => void;
}
 
export interface ClientFormProps {
   formData: ClientFormData;
   documentoError?: string;
   emailError?: string;
   buttonText: string;
   telefoneError?: string;
   disabled?: boolean;
   infosAdicionais?: boolean;
   onSubmit: (e: React.FormEvent) => void;
   onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
   onInputChangeDocumento: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onInputChangeEmailCliente: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onInputChangeTelefone: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onInputChangeEnderecoCep: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onBlurCEP: (e: React.FocusEvent<HTMLInputElement>) => void;
   onBlurCNPJ: (e: React.FocusEvent<HTMLInputElement>) => void;
}
 
 export type CustomSelectEvent = {
   target: {
     name: 'ativo';
     value: boolean;
   };
 };