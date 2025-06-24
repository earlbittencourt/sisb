export interface CriterioProjeto {
  id: number;
  item: string;
  descricao: string;
  peso: number;
}

export interface CategoriaCurriculo {
  id: number;
  sigla: string;
  descricao: string;
}

export interface ItemCurriculo {
  id: number;
  descricao: string;
  peso: number;
  automatico: boolean;
}

export interface SubArea {
  id: number;
  descricao: string;
}

export interface ItemAvaliacaoCompleto {
  id: number;
  itemId: number;
  itemDescricao: string;
  subareaId: number;
  subareaDescricao: string;
  areaDescricao: string;
  peso: number;
  automatico: boolean;
  teto?: number;
} 