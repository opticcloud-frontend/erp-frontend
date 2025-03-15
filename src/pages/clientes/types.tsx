export interface Cliente {
   id: string;
   name: string;
   email: string;
   telefone: string;
   enderecoCidade: string;
   nomeCompleto: string;
   tipoPessoa: {descricao: string};
   documento: string;
   descricao: string;
   enderecoEstado: string;
   razaoSocial: string;
   nomeFantasia: string;
   ativo: boolean;
   status: 'active' | 'inativo';
 }