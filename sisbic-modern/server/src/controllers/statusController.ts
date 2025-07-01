import { Request, Response } from 'express';
import { query } from '../config/database';

interface Status {
  PPS_Codigo: number;
  PPS_Descricao: string;
}

export async function listarStatus(req: Request, res: Response) {
  try {
    const status = await query<Status>('SELECT PPS_Codigo, PPS_Descricao FROM PPS_PeriodoProgramaStatus ORDER BY PPS_Descricao');
    console.log('Status disponíveis:', status.map(s => ({ id: s.PPS_Codigo, descricao: s.PPS_Descricao })));
    res.json(status);
  } catch (error) {
    console.error('Erro ao listar status:', error);
    res.status(500).json({ error: 'Erro ao listar status' });
  }
} 