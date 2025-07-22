export interface SituacaoTributaria {
  codigo: string;
}

export interface Tributacao {
  icmsSituacaoTributaria: SituacaoTributaria;
  pisSituacaoTributaria: SituacaoTributaria;
  cofinsSituacaoTributaria: SituacaoTributaria;
  ipiSituacaoTributaria: SituacaoTributaria;
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
  icmsAliquota: string;
  pisAliquota: string;
  cofinsAliquota: string;
  ipiAliquota: string;
  tributacao: Tributacao;
}

 
export interface produtoFormProps {
  formData: ProdutoFormData;
  buttonText: string;
  tributacao: string[];
  disabled?: boolean;
  infosAdicionais?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}
 
 export type CustomSelectEvent = {
   target: {
     name: 'ativo';
     value: boolean;
   };
 };