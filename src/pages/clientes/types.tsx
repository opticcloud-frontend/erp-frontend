export interface Cliente {
   id: string;
   name: string;
   emailCliente: string;
   telefone: string;
   enderecoCidade: string;
   nome: string;
   tipoCliente: string;
   documento: string;
   descricao: string;
   enderecoEstado: string;
   razaoSocial: string;
   nomeFantasia: string;
   ativo: boolean;
   status: 'active' | 'inativo';
 }