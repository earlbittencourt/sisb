export interface Agencia {
  AFO_Codigo: number;
  AFO_Descricao: string;
  AFO_Sigla: string;
}

export interface EditalAgencia {
  PEA_Codigo_PEP: number;
  PEA_Codigo_AFO: number;
  PEA_Cota: number;
  PEA_CotaDisponivel: number;
  agencia?: Agencia;
} 