export interface ProdutoFormData {
  nome: string,
  descricao: string,
  sku: string,
  codigoBarras: string,
  ncm: string,
  cest: string,
  cfop: string,
  unidade: number,
  origem: string,
  custoReposicao: number,
  lucroPercentual: number,
  valorVenda: number,
  genero: string,
  material: string,
  tipoProduto: string,
  marca: string,
  modelo: string,
  cor: string,
  ativo: boolean,
  observacoes : string,
  metodoPagamentoPreferido : string,
  limiteCredito : string,
}
 
export interface produtoFormProps {
  formData: ProdutoFormData;
  buttonText: string;
  disabled?: boolean;
  infosAdicionais?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onInputChangeEmailCliente: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
 
 export type CustomSelectEvent = {
   target: {
     name: 'ativo';
     value: boolean;
   };
 };