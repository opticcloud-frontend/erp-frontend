export interface FornecedorForm {
  idOtica: string;
  idUsuarioCadastro: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoComplemento: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoEstado: string;
  enderecoCep: string;
  ativo: boolean;
  observacoes: string;
  inscricaoEstadual: string;
  prazoPagamento: string;
}

export interface Fornecedor {
  idOtica: number;
  idUsuarioCadastro: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoComplemento: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoEstado: string;
  enderecoCep: string;
  ativo: boolean;
  observacoes: string;
  inscricaoEstadual: string;
  prazoPagamento: number;
}
