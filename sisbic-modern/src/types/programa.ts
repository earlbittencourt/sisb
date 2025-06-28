export interface Programa {
  id: number;
  titulo: string;
  tipo: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
  sigla: string;
  // Campos legados para manter compatibilidade
  PRO_Codigo: number;
  PRO_Descricao: string;
  PRO_Sigla: string;
}

export interface Status {
  PPS_Codigo: number;
  PPS_Descricao: string;
}

export interface PeriodoPrograma {
  PEP_Codigo: number;
  PEP_Sigla: string;
  PEP_Descricao: string;
  PEP_DtInicio: string;
  PEP_DtFim: string;
  PEP_Codigo_PRO: number;
  PEP_Codigo_PPS: number;
  PEP_Edital?: string;
}

export interface ProgramaCategoria {
  id: number;
  nome: string;
  descricao: string;
} 