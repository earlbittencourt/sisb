import { Request, Response } from 'express';
import { connectToDatabase, sql } from '../config/database';

// Busca todos os períodos de programas com filtros opcionais
export const getPeriodosProgramas = async (req: Request, res: Response) => {
    try {
        const { tipo, status } = req.query;
        const pool = await connectToDatabase();
        const request = pool.request();

        let queryString = `
            SELECT 
                p.PEP_Codigo,
                p.PEP_Sigla,
                p.PEP_Descricao,
                p.PEP_DtInicio,
                p.PEP_DtFim,
                p.PEP_Codigo_PRO,
                p.PEP_Codigo_PPS,
                pr.PRO_Descricao,
                ps.PPS_Descricao
            FROM 
                PEP_PeriodoPrograma p
            JOIN 
                PRO_Programa pr ON p.PEP_Codigo_PRO = pr.PRO_Codigo 
            JOIN 
                PPS_PeriodoProgramaStatus ps ON p.PEP_Codigo_PPS = ps.PPS_Codigo
        `;
        
        const whereClauses: string[] = [];
        if (tipo && tipo !== 'all') {
            whereClauses.push('p.PEP_Codigo_PRO = @tipo');
            request.input('tipo', sql.Int, tipo);
        }
        if (status && status !== 'all') {
            whereClauses.push('p.PEP_Codigo_PPS = @status');
            request.input('status', sql.Int, status);
        }

        if (whereClauses.length > 0) {
            queryString += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        
        const result = await request.query(queryString);
        res.json(result.recordset);

    } catch (error) {
        console.error('Erro ao buscar períodos dos programas:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

// Busca um período de programa específico pelo ID
export const getPeriodoProgramaById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    PEP_Codigo,
                    PEP_Sigla,
                    PEP_Descricao,
                    PEP_DtInicio,
                    PEP_DtFim,
                    PEP_Codigo_PRO,
                    PEP_Codigo_PPS,
                    PEP_edital,
                    PEP_editalArquivo,
                    PEP_nmProjetos,
                    PEP_nmPlanos,
                    PEP_nmAvaliadores,
                    PEP_avaliarProjeto,
                    PEP_cpf_usuario
                FROM PEP_PeriodoPrograma 
                WHERE PEP_Codigo = @id
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Período do programa não encontrado.' });
        }
        
        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Erro ao buscar período do programa por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Atualiza um período de programa
export const updatePeriodoPrograma = async (req: Request, res: Response) => {
    const { id } = req.params;
    const fieldsToUpdate = req.body;

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: 'Nenhum campo para atualizar foi fornecido.' });
    }

    const validFields = ['PEP_Codigo_PRO', 'PEP_Sigla', 'PEP_Descricao', 'PEP_DtInicio', 'PEP_DtFim', 'PEP_Codigo_PPS'];
    
    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        const setClause = Object.keys(fieldsToUpdate)
            .filter(key => validFields.includes(key) && fieldsToUpdate[key] !== undefined)
            .map(key => {
                let sqlType;
                if (key.includes('Codigo')) {
                    sqlType = sql.Int;
                } else if (key.includes('Dt')) {
                    sqlType = sql.Date;
                } else {
                    sqlType = sql.NVarChar;
                }
                request.input(key, sqlType, fieldsToUpdate[key]);
                return `${key} = @${key}`;
            })
            .join(', ');

        if (!setClause) {
            return res.status(400).json({ message: 'Nenhum campo válido para atualizar foi fornecido.' });
        }

        request.input('id', sql.Int, id);
        const queryString = `UPDATE PEP_PeriodoPrograma_user SET ${setClause} WHERE PEP_Codigo = @id`;
        await request.query(queryString);
        res.status(200).json({ message: 'Período do programa atualizado com sucesso.' });

    } catch (error) {
        console.error('Erro ao atualizar período do programa:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Deleta um período de programa
export const deletePeriodoPrograma = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const pool = await connectToDatabase();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM PEP_PeriodoPrograma_user WHERE PEP_Codigo = @id');
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar período do programa:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Funções relacionadas a agências de fomento do edital

// Lista as agências vinculadas a um edital específico
export const listarAgenciasPorEdital = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    agb.AGB_Codigo_PEP,
                    agb.AGB_Codigo_AGE,
                    agb.AGB_BolsasOferecidas AS AGB_Cota,
                    agb.AGB_BolsasUtilizadas AS BolsasUtilizadas,
                    age.AGE_Descricao,
                    age.AGE_Sigla
                FROM 
                    AGB_AgenciaFinanciadoraPEP agb
                JOIN 
                    AGE_AgenciaFinanciadora age ON agb.AGB_Codigo_AGE = age.AGE_Codigo
                WHERE 
                    agb.AGB_Codigo_PEP = @id
            `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Erro detalhado ao buscar agências do edital:', JSON.stringify(error, null, 2));
        res.status(500).send('Erro ao buscar agências do edital.');
    }
};

export const updateAgenciaEdital = async (req: Request, res: Response) => {
    const { id: editalId, agenciaId } = req.params;
    const { cotas } = req.body;

    if (cotas === undefined) {
        return res.status(400).send('O número de cotas é obrigatório.');
    }

    try {
        const pool = await connectToDatabase();
        await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('agenciaId', sql.Int, agenciaId)
            .input('cotas', sql.Int, cotas)
            .query(`
                UPDATE AGB_AgenciaFinanciadoraPEP
                SET AGB_BolsasOferecidas = @cotas 
                WHERE AGB_Codigo_PEP = @editalId AND AGB_Codigo_AGE = @agenciaId
            `);
        
        res.status(200).send('Cotas da agência atualizadas com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar cotas da agência:', error);
        res.status(500).send('Erro ao atualizar cotas da agência.');
    }
};

// Adiciona uma agência a um edital
export const adicionarAgenciaEdital = async (req: Request, res: Response) => {
    const { id: editalId } = req.params;
    const { agenciaId, cotas } = req.body;

    if (!agenciaId || cotas === undefined) {
        return res.status(400).send('Dados inválidos. Agência e cotas são obrigatórios.');
    }

    try {
        const pool = await connectToDatabase();
        await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('agenciaId', sql.Int, agenciaId)
            .input('cotas', sql.Int, cotas)
            .query(`
                INSERT INTO AGB_AgenciaFinanciadoraPEP (AGB_Codigo_PEP, AGB_Codigo_AGE, AGB_BolsasOferecidas)
                VALUES (@editalId, @agenciaId, @cotas)
            `);
        
        res.status(201).send('Agência adicionada com sucesso.');
    } catch (error) {
        console.error('Erro ao adicionar agência ao edital:', error);
        res.status(500).send('Erro ao adicionar agência ao edital.');
    }
};

// Deleta uma agência de um edital
export const deleteAgenciaEdital = async (req: Request, res: Response) => {
    const { id: editalId, agenciaId } = req.params;

    try {
        const pool = await connectToDatabase();
        
        // Medida de segurança: verifica se as bolsas utilizadas são realmente zero.
        const checkResult = await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('agenciaId', sql.Int, agenciaId)
            .query('SELECT AGB_BolsasUtilizadas FROM AGB_AgenciaFinanciadoraPEP WHERE AGB_Codigo_PEP = @editalId AND AGB_Codigo_AGE = @agenciaId');

        if (checkResult.recordset.length === 0) {
            return res.status(404).send('Vínculo da agência com o edital não encontrado.');
        }

        const bolsasUtilizadas = checkResult.recordset[0].AGB_BolsasUtilizadas;

        if (bolsasUtilizadas > 0) {
            return res.status(400).send('Não é possível excluir uma agência que possui bolsas utilizadas.');
        }
        
        await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('agenciaId', sql.Int, agenciaId)
            .query(`
                DELETE FROM AGB_AgenciaFinanciadoraPEP 
                WHERE AGB_Codigo_PEP = @editalId AND AGB_Codigo_AGE = @agenciaId
            `);
        
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar agência do edital:', error);
        res.status(500).send('Erro ao deletar agência do edital.');
    }
};

// --- Funções para Configuração de Submissão ---

export const getProjetoConfiguracao = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM PCF_ProjetoConfiguracao WHERE PCF_codigo_PEP = @id');
        
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            // Retorna um objeto padrão se não houver configuração
            res.status(200).json({
                PCF_nmProjetos: null,
                PCF_nmPlanos: null,
                PCF_nmAvaliadores: null,
                PCF_nmMinPlanos: null,
            });
        }
    } catch (error) {
        console.error('Erro ao buscar configuração de submissão:', error);
        res.status(500).send('Erro ao buscar configuração de submissão.');
    }
};

export const upsertProjetoConfiguracao = async (req: Request, res: Response) => {
    const { id: editalId } = req.params;
    const { PCF_nmProjetos, PCF_nmMinPlanos, PCF_nmPlanos, PCF_nmAvaliadores } = req.body;

    const query = `
        IF EXISTS (SELECT 1 FROM PCF_ProjetoConfiguracao WHERE PCF_codigo_PEP = @editalId)
        BEGIN
            UPDATE PCF_ProjetoConfiguracao
            SET 
                PCF_nmProjetos = @PCF_nmProjetos,
                PCF_nmMinPlanos = @PCF_nmMinPlanos,
                PCF_nmPlanos = @PCF_nmPlanos,
                PCF_nmAvaliadores = @PCF_nmAvaliadores
            WHERE PCF_codigo_PEP = @editalId;
        END
        ELSE
        BEGIN
            INSERT INTO PCF_ProjetoConfiguracao 
                (PCF_codigo_PEP, PCF_nmProjetos, PCF_nmMinPlanos, PCF_nmPlanos, PCF_nmAvaliadores)
            VALUES 
                (@editalId, @PCF_nmProjetos, @PCF_nmMinPlanos, @PCF_nmPlanos, @PCF_nmAvaliadores);
        END
    `;

    try {
        const pool = await connectToDatabase();
        await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('PCF_nmProjetos', sql.Int, PCF_nmProjetos)
            .input('PCF_nmMinPlanos', sql.Int, PCF_nmMinPlanos)
            .input('PCF_nmPlanos', sql.Int, PCF_nmPlanos)
            .input('PCF_nmAvaliadores', sql.Int, PCF_nmAvaliadores)
            .query(query);
        
        res.status(200).send('Configuração de submissão salva com sucesso.');
    } catch (error) {
        console.error('Erro ao salvar configuração de submissão:', error);
        res.status(500).send('Erro ao salvar configuração de submissão.');
    }
}; 