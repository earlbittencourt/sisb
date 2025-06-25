export interface Programa {
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
  PEP_Codigo_PRO: number;
  PEP_Sigla: string;
  PEP_Descricao: string;
  PEP_DtInicio: string;
  PEP_DtFim: string;
  PEP_Codigo_PPS: number;
  PRO_Descricao?: string; // Campo opcional do JOIN
  PPS_Descricao?: string; // Campo opcional do JOIN
  PEP_NomeArquivo?: string;
}

export interface ProgramaCategoria {
  id: number;
  nome: string;
  descricao: string;
} 