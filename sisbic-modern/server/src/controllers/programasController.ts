import { Request, Response } from 'express';
import { query } from '../config/database';

interface ProgramaDB {
  PRO_Codigo: number;
  PRO_Descricao: string;
  PRO_Sigla: string;
}

interface Programa {
  id: number;
  titulo: string;
  tipo: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
  sigla: string;
  PRO_Codigo: number;
  PRO_Descricao: string;
  PRO_Sigla: string;
}

export async function listarProgramas(req: Request, res: Response) {
  try {
    const programasDB = await query<ProgramaDB>(`
      SELECT DISTINCT 
        p.PRO_Codigo, 
        p.PRO_Descricao, 
        p.PRO_Sigla 
      FROM 
        PRO_Programa p
      INNER JOIN 
        PEP_PeriodoPrograma pep ON p.PRO_Codigo = pep.PEP_Codigo_PRO
      ORDER BY 
        p.PRO_Descricao
    `);
    
    // Mapeia os dados do banco para o formato esperado pelo frontend
    const programas: Programa[] = programasDB.map(programa => ({
      id: programa.PRO_Codigo,
      titulo: programa.PRO_Descricao,
      tipo: programa.PRO_Sigla,
      status: 'Ativo', // Por enquanto, vamos considerar todos ativos
      dataInicio: new Date().toISOString(), // Placeholder - ajustar conforme necessário
      dataFim: new Date().toISOString(), // Placeholder - ajustar conforme necessário
      descricao: programa.PRO_Descricao,
      sigla: programa.PRO_Sigla,
      PRO_Codigo: programa.PRO_Codigo,
      PRO_Descricao: programa.PRO_Descricao,
      PRO_Sigla: programa.PRO_Sigla
    }));

    res.json(programas);
  } catch (error) {
    console.error('Erro ao listar programas:', error);
    res.status(500).json({ error: 'Erro ao listar programas' });
  }
} 