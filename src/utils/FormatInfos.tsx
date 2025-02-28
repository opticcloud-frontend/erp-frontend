export class FormatInfos{
   public static formatCep(cep: string): string {
      cep = cep.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
      if (cep.length > 8) cep = cep.substring(0, 8); // Limita ao máximo de 8 dígitos
      return cep.replace(/(\d{5})(\d{3})/, '$1-$2'); // Formata como XXXXX-XXX
   }

   public static formatCNPJ(cnpj: string): string {
      cnpj = cnpj.replace(/\D/g, '');
      return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
   }

   public static formatCPF(cpf: string): string {
      cpf = cpf.replace(/\D/g, '');
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
   }

   public static formatTelefone = (telefone: string): string => {
      telefone = telefone.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
      if (telefone.length > 11) telefone = telefone.substring(0, 11); // Limita ao máximo de 11 dígitos
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
   };

}