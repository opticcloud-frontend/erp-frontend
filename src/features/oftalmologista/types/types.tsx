export interface OftalmologistaForm {
  idOtica: number;
  nomeCompleto: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
  clinicaHospital: string;
  observacoes: string;
  status: boolean;
}

export interface Oftalmologista {
  idOtica: number;
  nomeCompleto: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
  clinicaHospital: string;
  observacoes: string;
  status: boolean;
}

export interface OftalmologistaEditar extends Oftalmologista {
  id: number
}

