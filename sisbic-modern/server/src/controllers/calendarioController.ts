import { Request, Response } from 'express';
import sql from 'mssql';
import { connectToDatabase } from '../config/database';

// Tipos para o calendário
interface Evento {
    id: number;
    descricao: string;
}

interface Atividade {
    id: number;
    descricao: string;
    codigoRelatorio?: number;
}

interface EventoAtividadePEP {
    id: number;
    editalId: number;
    eventoId?: number;
    atividadeId?: number;
    dataInicio: Date;
    dataFim: Date;
    dataFimProrrogacao?: Date;
    usuario?: string;
    // Campos para exibição
    eventoDescricao?: string;
    atividadeDescricao?: string;
}

// Buscar todos os eventos disponíveis
export const getEventos = async (req: Request, res: Response) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .query(`
                SELECT 
                    EVE_Codigo as id,
                    EVE_Descricao as descricao
                FROM EVE_Evento
                ORDER BY EVE_Descricao
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar todas as atividades disponíveis
export const getAtividades = async (req: Request, res: Response) => {
    try {
        const { editalId } = req.params;
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT DISTINCT
                    aa.ATI_Codigo as id,
                    aa.ATI_Descricao as descricao,
                    aa.ATI_codigo_RES as codigoRelatorio
                FROM ATI_Atividade aa
                WHERE aa.ATI_codigo_PEP = @editalId OR aa.ATI_Codigo = 1
                ORDER BY aa.ATI_Descricao
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar calendário completo de um edital, AGRUPADO por atividade
export const getCalendarioEdital = async (req: Request, res: Response) => {
    try {
        const { editalId } = req.params;
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT 
                    aa.ATI_Codigo as 'atividadeId',
                    aa.ATI_Descricao as 'atividadeDescricao',
                    ee.EVE_Descricao as 'eventoDescricao',
                    eva.EVA_DtInicio as 'dataInicio',
                    eva.EVA_DtFim as 'dataFim',
                    eva.EVA_DtFimProrrogacao as 'dataFimProrrogacao',
                    eva.EVA_cpf_usuario as 'usuario',
                    eva.EVA_Codigo as 'id',
                    eva.EVA_Codigo_PEP as 'editalId',
                    eva.EVA_Codigo_EVE as 'eventoId'
                FROM ATI_Atividade aa
                LEFT JOIN EVA_EventoAtividadePEP eva ON eva.EVA_Codigo_ATI = aa.ATI_Codigo AND eva.EVA_Codigo_PEP = @editalId
                LEFT JOIN EVE_Evento ee ON ee.EVE_Codigo = eva.EVA_Codigo_EVE
                WHERE aa.ATI_codigo_PEP = @editalId OR aa.ATI_Codigo = 1
                ORDER BY aa.ATI_Descricao, eva.EVA_DtInicio
            `);

        const calendarioAgrupado = new Map<number, { atividadeId: number; atividadeDescricao: string; eventos: any[] }>();

        for (const row of result.recordset) {
            if (!calendarioAgrupado.has(row.atividadeId)) {
                calendarioAgrupado.set(row.atividadeId, {
                    atividadeId: row.atividadeId,
                    atividadeDescricao: row.atividadeDescricao,
                    eventos: []
                });
            }

            // Adiciona o evento apenas se ele existir (eva.EVA_Codigo não for nulo)
            if (row.id) {
                calendarioAgrupado.get(row.atividadeId)?.eventos.push({
                    id: row.id,
                    editalId: row.editalId,
                    eventoId: row.eventoId,
                    atividadeId: row.atividadeId,
                    dataInicio: row.dataInicio,
                    dataFim: row.dataFim,
                    dataFimProrrogacao: row.dataFimProrrogacao,
                    usuario: row.usuario,
                    eventoDescricao: row.eventoDescricao,
                });
            }
        }
        
        res.json(Array.from(calendarioAgrupado.values()));

    } catch (error) {
        console.error('Erro ao buscar calendário do edital:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Adicionar novo evento/atividade ao calendário
export const adicionarEventoCalendario = async (req: Request, res: Response) => {
    try {
        const { 
            editalId, 
            eventoId, 
            atividadeId, 
            dataInicio, 
            dataFim, 
            dataFimProrrogacao,
            usuario 
        } = req.body;

        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('eventoId', sql.Int, eventoId || null)
            .input('atividadeId', sql.Int, atividadeId || null)
            .input('dataInicio', sql.DateTime, new Date(dataInicio))
            .input('dataFim', sql.DateTime, new Date(dataFim))
            .input('dataFimProrrogacao', sql.DateTime, dataFimProrrogacao ? new Date(dataFimProrrogacao) : null)
            .input('usuario', sql.VarChar(25), usuario || null)
            .query(`
                INSERT INTO EVA_EventoAtividadePEP (
                    EVA_Codigo_PEP, 
                    EVA_Codigo_EVE, 
                    EVA_Codigo_ATI, 
                    EVA_DtInicio, 
                    EVA_DtFim, 
                    EVA_DtFimProrrogacao, 
                    EVA_cpf_usuario
                )
                VALUES (
                    @editalId, 
                    @eventoId, 
                    @atividadeId, 
                    @dataInicio, 
                    @dataFim, 
                    @dataFimProrrogacao, 
                    @usuario
                );
                
                SELECT SCOPE_IDENTITY() as id;
            `);
        
        const novoId = result.recordset[0].id;
        res.status(201).json({ 
            id: novoId, 
            message: 'Evento/atividade adicionado com sucesso' 
        });
    } catch (error) {
        console.error('Erro ao adicionar evento ao calendário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Atualizar evento/atividade do calendário
export const atualizarEventoCalendario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            eventoId, 
            atividadeId, 
            dataInicio, 
            dataFim, 
            dataFimProrrogacao,
            usuario 
        } = req.body;

        const pool = await connectToDatabase();
        await pool.request()
            .input('id', sql.Int, id)
            .input('eventoId', sql.Int, eventoId || null)
            .input('atividadeId', sql.Int, atividadeId || null)
            .input('dataInicio', sql.DateTime, new Date(dataInicio))
            .input('dataFim', sql.DateTime, new Date(dataFim))
            .input('dataFimProrrogacao', sql.DateTime, dataFimProrrogacao ? new Date(dataFimProrrogacao) : null)
            .input('usuario', sql.VarChar(25), usuario || null)
            .query(`
                UPDATE EVA_EventoAtividadePEP
                SET 
                    EVA_Codigo_EVE = @eventoId,
                    EVA_Codigo_ATI = @atividadeId,
                    EVA_DtInicio = @dataInicio,
                    EVA_DtFim = @dataFim,
                    EVA_DtFimProrrogacao = @dataFimProrrogacao,
                    EVA_cpf_usuario = @usuario
                WHERE EVA_Codigo = @id
            `);
        
        res.json({ message: 'Evento/atividade atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar evento do calendário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Excluir evento/atividade do calendário
export const excluirEventoCalendario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await connectToDatabase();
        
        await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM EVA_EventoAtividadePEP
                WHERE EVA_Codigo = @id
            `);
        
        res.json({ message: 'Evento/atividade excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir evento do calendário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 