export interface ClientFormData {
  descricaoTipoCliente: string;
  ativo: boolean;
  nome: string;
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
 
 export interface ClientFormProps {
   formData: ClientFormData;
   documentoError?: string;
   emailError?: string;
   buttonText: string;
   telefoneError?: string;
   displayDocumento: string;
   METODOS_PAGAMENTO: Array<{ value: string; label: string }>;
   disabled?: boolean;
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