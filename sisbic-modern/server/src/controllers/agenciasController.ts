import { Request, Response } from 'express';
import sql from 'mssql';
import { connectToDatabase } from '../config/database';

// Lista todas as agências de fomento disponíveis
export const listarAgencias = async (req: Request, res: Response) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request().query('SELECT AGE_Codigo, AGE_Descricao, AGE_Sigla FROM AGE_AgenciaFinanciadora');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar agências de fomento:', error);
        res.status(500).send('Erro ao buscar agências de fomento.');
    }
};
