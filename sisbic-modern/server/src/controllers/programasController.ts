import { Request, Response } from 'express';
import { query } from '../config/database';

interface Programa {
  PRO_Codigo: number;
  PRO_Descricao: string;
  PRO_Sigla: string;
}

export async function listarProgramas(req: Request, res: Response) {
  try {
    const programas = await query<Programa>('SELECT PRO_Codigo, PRO_Descricao, PRO_Sigla FROM PRO_Programa ORDER BY PRO_Descricao');
    res.json(programas);
  } catch (error) {
    console.error('Erro ao listar programas:', error);
    res.status(500).json({ error: 'Erro ao listar programas' });
  }
} 