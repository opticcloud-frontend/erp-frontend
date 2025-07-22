export const infosTributacao = {
   icmsSituacaoTributaria: { 
      codigo: '' 
   },
   pisSituacaoTributaria: { 
      codigo: '' 
   },
   cofinsSituacaoTributaria: { 
      codigo: '' 
   },
   ipiSituacaoTributaria: { 
      codigo: '' 
   },
};

export const infosProdutos = {
  nome: '',
  descricao: '',
  sku: '',
  codigoBarras: '',
  ncm: '',
  cest: '',
  cfop: '',
  unidade: 'UN',
  origem: 'Nacional',
  custoReposicao: 0,
  lucroPercentual: 0,
  valorVenda: 0,
  genero: 'Feminino',
  material: '',
  tipoProduto: 'Lente',
  marca: '',
  modelo: '',
  cor: '',
  ativo: true,
  observacoes: '',
  idOtica: '',
  icmsAliquota: '',
  pisAliquota: '',
  cofinsAliquota: '',
  ipiAliquota: '',
  tributacao: infosTributacao
};

export const icmsSituacaoTributariaOptions = [
  { value: '00', label: 'Tributada integralmente' },
  { value: '10', label: 'Tributada e com cobrança do ICMS por substituição tributária' },
  { value: '20', label: 'Com redução de base de cálculo' },
  { value: '30', label: 'Isenta ou não tributada e com cobrança do ICMS por substituição tributária' },
  { value: '40', label: 'Isenta' },
  { value: '41', label: 'Não tributada' },
  { value: '50', label: 'Suspensão' },
  { value: '51', label: 'Diferimento' },
  { value: '60', label: 'ICMS cobrado anteriormente por substituição tributária' },
  { value: '70', label: 'Com redução de base de cálculo e cobrança do ICMS por substituição tributária' },
  { value: '90', label: 'Outras' },
];

export const pisSituacaoTributariaOptions = [
  { value: '01', label: 'Operação tributável com alíquota básica' },
  { value: '02', label: 'Operação tributável com alíquota diferenciada' },
  { value: '03', label: 'Operação tributável com alíquota por unidade de medida de produto' },
  { value: '04', label: 'Operação tributável monofásica – revenda a alíquota zero' },
  { value: '05', label: 'Operação tributável por substituição tributária' },
  { value: '06', label: 'Operação tributável a alíquota zero' },
  { value: '07', label: 'Operação isenta da contribuição' },
  { value: '08', label: 'Operação sem incidência da contribuição' },
  { value: '09', label: 'Operação com suspensão da contribuição' },
  { value: '49', label: 'Outras operações de saída' },
];

export const cofinsSituacaoTributariaOptions = [
  { value: '01', label: 'Operação tributável com alíquota básica' },
  { value: '02', label: 'Operação tributável com alíquota diferenciada' },
  { value: '03', label: 'Operação tributável com alíquota por unidade de medida de produto' },
  { value: '04', label: 'Operação tributável monofásica – revenda a alíquota zero' },
  { value: '05', label: 'Operação tributável por substituição tributária' },
  { value: '06', label: 'Operação tributável a alíquota zero' },
  { value: '07', label: 'Operação isenta da contribuição' },
  { value: '08', label: 'Operação sem incidência da contribuição' },
  { value: '09', label: 'Operação com suspensão da contribuição' },
  { value: '49', label: 'Outras operações de saída' },
];

export const ipiSituacaoTributariaOptions = [
  { value: '00', label: 'Entrada com recuperação de crédito' },
  { value: '01', label: 'Entrada tributada com alíquota zero' },
  { value: '02', label: 'Entrada isenta' },
  { value: '03', label: 'Entrada não-tributada' },
  { value: '04', label: 'Entrada imune' },
  { value: '05', label: 'Entrada com suspensão' },
  { value: '49', label: 'Outras entradas' },
  { value: '50', label: 'Saída tributada' },
  { value: '51', label: 'Saída tributável com alíquota zero' },
  { value: '52', label: 'Saída isenta' },
  { value: '53', label: 'Saída não-tributada' },
  { value: '54', label: 'Saída imune' },
  { value: '55', label: 'Saída com suspensão' },
  { value: '99', label: 'Outras saídas' },
];


export const infos_tipo_produto = [
   { value: 'Lente', label: 'Lente' },
   { value: 'Armação', label: 'Armação' },
   { value: 'Acessório', label: 'Acessório' },
   { value: 'Óculos de Sol', label: 'Óculos de Sol' },
   { value: 'Outro', label: 'Outro' },
];

export const infos_genero_produto = [
   { value: 'Feminino', label: 'Feminino' },
   { value: 'Masculino', label: 'Masculino' },
   { value: 'Acessório', label: 'Acessório' },
   { value: 'Unissex', label: 'Unissex' },
];

export const infos_origem_produto = [
   { value: 'Nacional', label: 'Nacional' },
   { value: 'Estrangeiro', label: 'Estrangeiro' },
   { value: 'Nacional – Produto em Processo', label: 'Nacional – Produto em Processo' },
   { value: 'Estrangeiro – Importado diretamente', label: 'Estrangeiro – Importado diretamente' },
];

export const infos_unidade_produto = [
   { value: 'UN', label: 'UN' },
   { value: 'Litro', label: 'Litro' },
];

export const infos_metodos_pagamentos = [
   { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
   { value: 'PIX', label: 'PIX' },
   { value: 'Boleto Bancário', label: 'Boleto Bancário' },
   { value: 'Transferência Bancária', label: 'Transferência Bancária' },
   { value: 'Carnê', label: 'Carnê' },
];

export const infos_situacao = [
   { value: 'active', label: 'Ativo' },
   { value: 'inactive', label: 'Inativo'},
];