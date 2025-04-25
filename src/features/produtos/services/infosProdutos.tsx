export const infosProdutos = {
   nome: '',
   descricao: '',
   sku: '',
   codigoBarras: '',
   ncm: '',
   cest: '',
   cfop: '',
   unidade: '',
   origem: '',
   custoReposicao: '',
   lucroPercentual: '',
   valorVenda: '',
   genero: '',
   material: '',
   tipoProduto: '',
   marca: '',
   modelo: '',
   cor: '',
   ativo: true,
   observacoes: '',
};

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