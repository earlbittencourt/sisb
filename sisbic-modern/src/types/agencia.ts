export interface Agencia {
  AGE_Codigo: number;
  AGE_Descricao: string;
  AGE_Sigla: string;
}

export interface EditalAgencia {
  AGB_Codigo_PEP: number;
  AGB_Codigo_AGE: number;
  AGB_Cota: number;
  AGE_Descricao: string;
  AGE_Sigla: string;
  BolsasUtilizadas: number;
} 