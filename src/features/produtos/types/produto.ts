
// Tipo base com todos os campos comuns
export interface ProdutoBase {
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
}

export interface ProdutoFormData extends ProdutoBase {
  tributacao: Tributacao;
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

export interface Produto extends ProdutoBase {
  id: string
  dataCadastro: string;
  tributacao: TributacaoOpcoes | TributacaoSelect;
}

type TributacaoOpcoes  = {
  icmsAliquota:  number | undefined;
  pisAliquota:  number | undefined;
  cofinsAliquota:  number | undefined;
  ipiAliquota:  number | undefined;
  cofinsSituacaoTributaria: Option[] ;
  icmsSituacaoTributaria: Option[];
  ipiSituacaoTributaria: Option[];
  pisSituacaoTributaria: Option[];
};

type Option = { 
  codigo: string;
  descricao: string;
};

export interface ProdutoFormEditData extends ProdutoBase {
  id: string;
  dataCadastro: string;
  tributacao: TributacaoSelect
}


export interface TributacaoSelect {
  icmsAliquota:  number | undefined;
  pisAliquota:  number | undefined;
  cofinsAliquota:  number | undefined;
  ipiAliquota:  number | undefined;
  icmsSituacaoTributaria: { codigo: string, descricao: string };
  pisSituacaoTributaria: { codigo: string, descricao: string };
  cofinsSituacaoTributaria: { codigo: string, descricao: string };
  ipiSituacaoTributaria: { codigo: string, descricao: string };
}
export interface SituacaoTributaria {
  codigo: string;
  descricao: string;
}

export interface produtoFormEditarProps {
  formData: Produto;
  buttonText: string;
  tributacao?: TributacaoOpcoes | null;
  disabled?: boolean;
  abaAtiva?: string;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

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