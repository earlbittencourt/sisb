export interface Programa {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'PIBIC' | 'PIBITI' | 'PIBIC-AF' | 'PIBIC-EM';
  status: 'ativo' | 'inativo';
}

export interface PeriodoPrograma {
  id: number;
  programaId: number;
  programa_nome?: string;
  programa_tipo?: string;
  titulo: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  anoBase: number;
  status: 'em_elaboracao' | 'inscricoes_abertas' | 'em_avaliacao' | 'concluido' | 'cancelado';
  orcamento: number;
} 