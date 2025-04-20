export interface Cliente {
  nomeCompleto: string,
  emailUsuarioCadastro: string,
  descricaoTipoCliente: string,
  oticaId: string,
  telefone: string, 
  dataNascimento: string,
  razaoSocial: string,
  nomeFantasia: string,
  responsavelLegal: string,
  limiteCredito: string,
  metodoPagamentoPreferido: string,
  indicadorCliente: string,
  preferencias: string,
  observacoes: string,
  ativo: boolean,
  email: string,
  documento: string,
  enderecoCep: string,
  enderecoLogradouro: string,
  enderecoNumero: string,
  enderecoComplemento: string,
  enderecoBairro: string,
  enderecoCidade: string,
  enderecoEstado: string,
  inscricaoEstadual: string,
}  

export interface User {
   id: string;
   email: string;
   name: string;
   role: string;
   created_at: string;
   updated_at: string;
   id_oticas: number[];
   token: string;
}

 
 type StatusType = Record<string, unknown>

 export interface AuthContextType {
   isAuthenticated: boolean;
   login: (user: User) => void;
   logout: (status?: StatusType) => void;
   userData: User | null;
   setClienteData: (cliente: Cliente | undefined) => void;
   clienteData: Cliente | undefined;
 }