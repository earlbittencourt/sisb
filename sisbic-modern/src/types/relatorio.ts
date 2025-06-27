export interface Relatorio {
  id: number;
  editalId: number;
  descricao: string;
  avaliadores: number;
}

export interface ConceitoRelatorio {
  id: number;
  relatorioId: number;
  descricao: string;
  nivel: number;
}

// Representa um item que pode ser usado na avaliação (mestre)
export interface ItemAvaliacao {
  id: number;
  descricao: string;
}

// Representa um item de avaliação associado a um relatório específico
export interface ItemAvaliacaoRelatorio {
  id: number; // ID da associação (e.g., IAP_codigo)
  relatorioId: number;
  itemId: number;
  itemDescricao: string;
  variacaoNota: string;
}

export interface EstruturaRelatorioCriterio {
  id: number;
  descricao: string;
}

export interface EstruturaRelatorioItem {
  id: number;
  descricao: string;
  criterios: EstruturaRelatorioCriterio[];
  variacaoNota: string;
}

export interface EstruturaRelatorioCategoria {
  id: number;
  descricao: string;
  itens: EstruturaRelatorioItem[];
} 