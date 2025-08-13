export interface SituacaoTributaria {
  codigo: string;
  descricao: string;
}

export interface Tributacao {
  icmsAliquota:  number | undefined;
  pisAliquota:  number | undefined;
  cofinsAliquota:  number | undefined;
  ipiAliquota:  number | undefined;
  icmsSituacaoTributaria: { codigo: string };
  pisSituacaoTributaria: { codigo: string };
  cofinsSituacaoTributaria: { codigo: string };
  ipiSituacaoTributaria: { codigo: string };
}

export interface ProdutoFormData {
  nome: string;
  descricao: string;
  sku: string;
  codigoBarras: string;
  ncm: string;
  cest: string;
  cfop: string;
  unidade: string;
  origem: string;
  custoReposicao: number | undefined;
  lucroPercentual: number | undefined;
  valorVenda: number | undefined;
  genero: string;
  material: string;
  tipoProduto: string;
  marca: string;
  modelo: string;
  cor: string;
  ativo: boolean;
  observacoes: string;
  idOtica: string;
  
  tributacao: Tributacao;
}

export interface Produto {
  id: string
  nome: string;
  descricao: string;
  sku: string;
  codigoBarras: string;
  ncm: string;
  cest: string;
  cfop: string;
  unidade: string;
  origem: string;
  custoReposicao: number;
  lucroPercentual: number;
  valorVenda: number;
  genero: string;
  material: string;
  tipoProduto: string;
  marca: string;
  modelo: string;
  cor: string;
  ativo: boolean;
  observacoes: string;
  idOtica: string;
  dataCadastro: string;
  tributacao: TributacaoOpcoes;
}

type Option = { 
  codigo: string;
  descricao: string;
};
 
type TributacaoOpcoes  = {
  icmsAliquota:  number | undefined;
  pisAliquota:  number | undefined;
  cofinsAliquota:  number | undefined;
  ipiAliquota:  number | undefined;
  cofinsSituacaoTributaria: Option[];
  icmsSituacaoTributaria: Option[];
  ipiSituacaoTributaria: Option[];
  pisSituacaoTributaria: Option[];
};

 
export interface produtoFormProps {
  formData: ProdutoFormData | Produto;
  buttonText: string;
  tributacao?: TributacaoOpcoes | null;
  disabled?: boolean;
  abaAtiva?: string;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}
 
 export type CustomSelectEvent = {
   target: {
     name: 'ativo';
     value: boolean;
   };
 };