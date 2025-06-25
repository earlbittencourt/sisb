import { Request, Response } from 'express';
import sql from 'mssql';
import { connectToDatabase, query } from '../config/database';

// Buscar critérios de avaliação de projeto para um edital específico
export const getCriteriosProjeto = async (req: Request, res: Response) => {
    try {
        const { editalId } = req.params;
        const pool = await connectToDatabase();
        
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT 
                    IPR.IPR_codigo as id,
                    IPR.IPR_descricao as descricao,
                    IPR.IPR_descricao as item,
                    COALESCE(CAST(IPP.IPP_peso AS DECIMAL(5,2)), 0) as peso
                FROM
                    IPP_ItemAvaliacaoProjetoPEP IPP
                INNER JOIN
                    IPR_ItemAvaliacaoProjeto IPR ON IPP.IPP_codigo_IPR = IPR.IPR_codigo
                WHERE
                    IPP.IPP_codigo_PEP = @editalId
                ORDER BY
                    IPR.IPR_codigo
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar critérios de projeto:', error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
};

// Buscar pesos dos critérios para um edital específico
export const getPesosCriteriosProjeto = async (req: Request, res: Response) => {
    try {
        const { editalId } = req.params;
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT 
                    IPP_Codigo as id,
                    IPP_Codigo_IPR as criterioId,
                    IPP_Codigo_PEP as editalId,
                    IPP_Peso as peso
                FROM IPP_ItemAvaliacaoProjetoPEP
                WHERE IPP_Codigo_PEP = @editalId
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar pesos dos critérios:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Salvar/atualizar peso de um critério para um edital
export const salvarPesoCriterio = async (req: Request, res: Response) => {
    try {
        const { editalId, criterioId, peso } = req.body;
        const pool = await connectToDatabase();
        
        // Verificar se já existe um registro para este critério/edital
        const existing = await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('criterioId', sql.Int, criterioId)
            .query(`
                SELECT IPP_Codigo 
                FROM IPP_ItemAvaliacaoProjetoPEP 
                WHERE IPP_Codigo_PEP = @editalId AND IPP_Codigo_IPR = @criterioId
            `);
        
        if (existing.recordset.length > 0) {
            // Atualizar registro existente
            await pool.request()
                .input('editalId', sql.Int, editalId)
                .input('criterioId', sql.Int, criterioId)
                .input('peso', sql.Decimal(5,2), peso)
                .query(`
                    UPDATE IPP_ItemAvaliacaoProjetoPEP 
                    SET IPP_Peso = @peso 
                    WHERE IPP_Codigo_PEP = @editalId AND IPP_Codigo_IPR = @criterioId
                `);
        } else {
            // Inserir novo registro
            await pool.request()
                .input('editalId', sql.Int, editalId)
                .input('criterioId', sql.Int, criterioId)
                .input('peso', sql.Decimal(5,2), peso)
                .query(`
                    INSERT INTO IPP_ItemAvaliacaoProjetoPEP (IPP_Codigo_PEP, IPP_Codigo_IPR, IPP_Peso)
                    VALUES (@editalId, @criterioId, @peso)
                `);
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao salvar peso do critério:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar sub-áreas
export const getSubAreas = async (req: Request, res: Response) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .query(`
                SELECT 
                    SAR_Codigo as id,
                    SAR_Descricao as descricao
                FROM SAR_Subarea
                ORDER BY SAR_Descricao
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar sub-áreas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar categorias de avaliação para um edital
export const getCategoriasAvaliacao = async (req: Request, res: Response) => {
    try {
        const { editalId } = req.params;
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT 
                    CAV_Codigo as id,
                    CAV_Codigo_PEP as editalId,
                    CAV_Sigla as sigla,
                    CAV_Descricao as descricao
                FROM CAV_CategoriaAvaliacao
                WHERE CAV_Codigo_PEP = @editalId
                ORDER BY CAV_Sigla
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar categorias de avaliação:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar dados completos das categorias com subáreas e itens
export const getCategoriasCompletas = async (req: Request, res: Response) => {
    try {
        const { editalId } = req.params;
        const pool = await connectToDatabase();
        
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT 
                    cav.CAV_codigo as categoriaId,
                    cav.CAV_sigla as categoriaSigla,
                    cav.CAV_descricao as categoriaDescricao,
                    ss.SAR_codigo as subareaId,
                    ss.SAR_descricao as subareaDescricao,
                    aa.ARE_descricao as areaDescricao,
                    ita.ITA_codigo as itemId,
                    ita.ITA_descricao as itemDescricao,
                    iiap.IPS_peso as itemPeso,
                    iiap.IPS_ch_automatico as automatico
                FROM CAV_CategoriaAvaliacao cav
                LEFT JOIN IPS_ItemAvaliacaoPeso iiap ON iiap.IPS_codigo_CAV = cav.CAV_codigo
                LEFT JOIN SAR_Subarea ss ON iiap.IPS_codigo_SAR = ss.SAR_codigo
                LEFT JOIN ARE_Area aa ON ss.SAR_codigo_ARE = aa.ARE_codigo
                LEFT JOIN ITA_ItemAvaliacao ita ON iiap.IPS_codigo_ITA = ita.ITA_codigo
                WHERE cav.CAV_codigo_PEP = @editalId
                ORDER BY cav.CAV_sigla, aa.ARE_descricao, ss.SAR_descricao, ita.ITA_descricao
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar dados completos das categorias:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Otimização: Buscar apenas áreas e subáreas para um edital
export const getAreasComSubareas = async (req: Request, res: Response) => {
    try {
        const { editalId } = req.params;
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT DISTINCT
                    aa.ARE_descricao as area,
                    ss.SAR_codigo as subareaId,
                    ss.SAR_descricao as subareaNome
                FROM CAV_CategoriaAvaliacao cav
                INNER JOIN IPS_ItemAvaliacaoPeso iiap ON iiap.IPS_codigo_CAV = cav.CAV_codigo
                INNER JOIN SAR_Subarea ss ON iiap.IPS_codigo_SAR = ss.SAR_codigo
                INNER JOIN ARE_Area aa ON ss.SAR_codigo_ARE = aa.ARE_codigo
                WHERE cav.CAV_codigo_PEP = @editalId
                ORDER BY area, subareaNome
            `);

        const groupedByArea = result.recordset.reduce((acc, row) => {
            const { area, subareaId, subareaNome } = row;
            if (!acc[area]) {
                acc[area] = { area, subareas: [] };
            }
            acc[area].subareas.push({ id: subareaId, nome: subareaNome });
            return acc;
        }, {});

        res.json(Object.values(groupedByArea));

    } catch (error) {
        console.error('Erro ao buscar áreas com subáreas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Otimização: Buscar critérios para uma subárea específica de um edital
export const getCriteriosPorSubarea = async (req: Request, res: Response) => {
    try {
        const { editalId, subareaId } = req.params;
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('subareaId', sql.Int, subareaId)
            .query(`
                SELECT
                    cav.CAV_codigo as categoriaId,
                    cav.CAV_sigla as categoriaSigla,
                    cav.CAV_descricao as categoriaDescricao,
                    ita.ITA_codigo as itemId,
                    ita.ITA_descricao as itemDescricao,
                    iiap.IPS_peso as itemPeso,
                    iiap.IPS_ch_automatico as automatico
                FROM CAV_CategoriaAvaliacao cav
                INNER JOIN IPS_ItemAvaliacaoPeso iiap
                    ON iiap.IPS_codigo_CAV = cav.CAV_codigo
                INNER JOIN ITA_ItemAvaliacao ita
                    ON iiap.IPS_codigo_ITA = ita.ITA_codigo
                WHERE cav.CAV_codigo_PEP = @editalId AND iiap.IPS_codigo_SAR = @subareaId
                ORDER BY cav.CAV_sigla, ita.ITA_descricao
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar critérios por subárea:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar itens de avaliação para uma sub-área
export const getItensAvaliacao = async (req: Request, res: Response) => {
    try {
        const { subAreaId } = req.params;
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('subAreaId', sql.Int, subAreaId)
            .query(`
                SELECT 
                    ITA_codigo as id,
                    ITA_descricao as item,
                    ITA_descricao as descricao
                FROM ITA_ItemAvaliacao
                ORDER BY ITA_descricao
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar itens de avaliação:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar pesos dos itens para um edital e sub-área
export const getPesosItensAvaliacao = async (req: Request, res: Response) => {
    try {
        const { editalId, subAreaId } = req.params;
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('subAreaId', sql.Int, subAreaId)
            .query(`
                SELECT 
                    CAP_Codigo as id,
                    CAP_Codigo_PEP as editalId,
                    CAP_Codigo_ITA as itemId,
                    CAP_Peso as peso,
                    CAP_Teto as teto
                FROM CAP_CategoriaAvaliacaoPeso
                WHERE CAP_Codigo_PEP = @editalId 
                AND CAP_Codigo_SAR = @subAreaId
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar pesos dos itens:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Salvar/atualizar peso e teto de um item
export const salvarPesoItem = async (req: Request, res: Response) => {
    try {
        const { editalId, subAreaId, itemId, peso, teto } = req.body;
        const pool = await connectToDatabase();
        
        // Verificar se já existe um registro
        const existing = await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('subAreaId', sql.Int, subAreaId)
            .input('itemId', sql.Int, itemId)
            .query(`
                SELECT CAP_Codigo 
                FROM CAP_CategoriaAvaliacaoPeso 
                WHERE CAP_Codigo_PEP = @editalId 
                AND CAP_Codigo_SAR = @subAreaId 
                AND CAP_Codigo_ITA = @itemId
            `);
        
        if (existing.recordset.length > 0) {
            // Atualizar registro existente
            await pool.request()
                .input('editalId', sql.Int, editalId)
                .input('subAreaId', sql.Int, subAreaId)
                .input('itemId', sql.Int, itemId)
                .input('peso', sql.Decimal(5,2), peso)
                .input('teto', sql.Decimal(8,2), teto)
                .query(`
                    UPDATE CAP_CategoriaAvaliacaoPeso 
                    SET CAP_Peso = @peso, CAP_Teto = @teto
                    WHERE CAP_Codigo_PEP = @editalId 
                    AND CAP_Codigo_SAR = @subAreaId 
                    AND CAP_Codigo_ITA = @itemId
                `);
        } else {
            // Inserir novo registro
            await pool.request()
                .input('editalId', sql.Int, editalId)
                .input('subAreaId', sql.Int, subAreaId)
                .input('itemId', sql.Int, itemId)
                .input('peso', sql.Decimal(5,2), peso)
                .input('teto', sql.Decimal(8,2), teto)
                .query(`
                    INSERT INTO CAP_CategoriaAvaliacaoPeso 
                    (CAP_Codigo_PEP, CAP_Codigo_SAR, CAP_Codigo_ITA, CAP_Peso, CAP_Teto)
                    VALUES (@editalId, @subAreaId, @itemId, @peso, @teto)
                `);
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao salvar peso do item:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const getDisponiveisCriteriosProjeto = async (req: Request, res: Response) => {
    const { editalId } = req.params;
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT 
                    IPR_codigo as id,
                    IPR_descricao as item,
                    IPR_descricao as descricao
                FROM IPR_ItemAvaliacaoProjeto
                WHERE IPR_codigo NOT IN (
                    SELECT IPP_Codigo_IPR 
                    FROM IPP_ItemAvaliacaoProjetoPEP 
                    WHERE IPP_Codigo_PEP = @editalId
                )
                ORDER BY IPR_descricao;
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar critérios de projeto disponíveis:', error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error });
    }
};

export const createCriterioProjeto = async (req: Request, res: Response) => {
    const { item, descricao } = req.body;
    try {
        const pool = await connectToDatabase();
        
        // Verificar se já existe um critério com a mesma descrição
        const existing = await pool.request()
            .input('item', sql.VarChar, item)
            .query(`
                SELECT IPR_codigo, IPR_descricao 
                FROM IPR_ItemAvaliacaoProjeto 
                WHERE IPR_descricao = @item
            `);
        
        if (existing.recordset.length > 0) {
            return res.status(400).json({ 
                error: 'Critério já existe', 
                message: 'Já existe um critério com esta descrição',
                existingCriterio: existing.recordset[0]
            });
        }
        
        const result = await pool.request()
            .input('item', sql.VarChar, item)
            .query(`
                INSERT INTO IPR_ItemAvaliacaoProjeto (IPR_descricao)
                OUTPUT inserted.IPR_codigo as id, inserted.IPR_descricao as item, inserted.IPR_descricao as descricao
                VALUES (@item);
            `);

        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Erro ao criar critério de projeto:', error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error });
    }
};

// Remover critério de projeto de um edital
export const removerCriterioProjeto = async (req: Request, res: Response) => {
    try {
        const { editalId, criterioId } = req.params;
        const pool = await connectToDatabase();
        
        // Verificar se o critério está associado ao edital
        const existing = await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('criterioId', sql.Int, criterioId)
            .query(`
                SELECT IPP_Codigo 
                FROM IPP_ItemAvaliacaoProjetoPEP 
                WHERE IPP_Codigo_PEP = @editalId AND IPP_Codigo_IPR = @criterioId
            `);
        
        if (existing.recordset.length === 0) {
            return res.status(404).json({ error: 'Critério não encontrado neste edital' });
        }
        
        // Verificar se existem avaliações de projetos que usam este critério
        const avaliacoes = await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('criterioId', sql.Int, criterioId)
            .query(`
                SELECT COUNT(*) as total
                FROM PAV_ProjetoAvaliacao pav
                INNER JOIN IPP_ItemAvaliacaoProjetoPEP ipp ON pav.PAV_codigo_IPP = ipp.IPP_Codigo
                WHERE ipp.IPP_Codigo_PEP = @editalId AND ipp.IPP_Codigo_IPR = @criterioId
            `);
        
        const totalAvaliacoes = avaliacoes.recordset[0].total;
        
        if (totalAvaliacoes > 0) {
            return res.status(400).json({ 
                error: 'Não é possível remover o critério',
                message: `Existem ${totalAvaliacoes} avaliação(ões) de projeto(s) que utilizam este critério. Remova as avaliações primeiro.`
            });
        }
        
        // Remover a associação do critério com o edital
        await pool.request()
            .input('editalId', sql.Int, editalId)
            .input('criterioId', sql.Int, criterioId)
            .query(`
                DELETE FROM IPP_ItemAvaliacaoProjetoPEP 
                WHERE IPP_Codigo_PEP = @editalId AND IPP_Codigo_IPR = @criterioId
            `);
        
        res.json({ success: true, message: 'Critério removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover critério de projeto:', error);
        
        // Verificar se é um erro de constraint
        if (error instanceof Error && error.message.includes('REFERENCE constraint')) {
            return res.status(400).json({ 
                error: 'Não é possível remover o critério',
                message: 'Este critério está sendo utilizado em avaliações de projetos. Remova as avaliações primeiro.'
            });
        }
        
        res.status(500).json({ error: 'Erro interno do servidor', details: error });
    }
};

// Debug: Verificar todas as categorias e seus dados
export const debugCategorias = async (req: Request, res: Response) => {
    try {
        const { editalId } = req.params;
        const pool = await connectToDatabase();
        
        // 1. Verificar categorias do edital
        const categorias = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT 
                    CAV_codigo as categoriaId,
                    CAV_sigla as categoriaSigla,
                    CAV_descricao as categoriaDescricao
                FROM CAV_CategoriaAvaliacao
                WHERE CAV_codigo_PEP = @editalId
                ORDER BY CAV_sigla
            `);
        
        // 2. Verificar pesos de categoria por subárea
        const pesosCategoria = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT 
                    cap.CAP_codigo_CAV as categoriaId,
                    cav.CAV_sigla as categoriaSigla,
                    cap.CAP_codigo_SAR as subareaId,
                    ss.SAR_descricao as subareaDescricao,
                    cap.CAP_peso as peso
                FROM CAP_CategoriaAvaliacaoPeso cap
                INNER JOIN CAV_CategoriaAvaliacao cav ON cap.CAP_codigo_CAV = cav.CAV_codigo
                INNER JOIN SAR_Subarea ss ON cap.CAP_codigo_SAR = ss.SAR_codigo
                WHERE cav.CAV_codigo_PEP = @editalId
                ORDER BY cav.CAV_sigla, ss.SAR_descricao
            `);
        
        // 3. Verificar itens de avaliação por categoria e subárea
        const itensAvaliacao = await pool.request()
            .input('editalId', sql.Int, editalId)
            .query(`
                SELECT 
                    iiap.IPS_codigo_CAV as categoriaId,
                    cav.CAV_sigla as categoriaSigla,
                    iiap.IPS_codigo_SAR as subareaId,
                    ss.SAR_descricao as subareaDescricao,
                    iiap.IPS_codigo_ITA as itemId,
                    ita.ITA_descricao as itemDescricao,
                    iiap.IPS_peso as itemPeso,
                    iiap.IPS_ch_automatico as automatico
                FROM IPS_ItemAvaliacaoPeso iiap
                INNER JOIN CAV_CategoriaAvaliacao cav ON iiap.IPS_codigo_CAV = cav.CAV_codigo
                INNER JOIN SAR_Subarea ss ON iiap.IPS_codigo_SAR = ss.SAR_codigo
                INNER JOIN ITA_ItemAvaliacao ita ON iiap.IPS_codigo_ITA = ita.ITA_codigo
                WHERE cav.CAV_codigo_PEP = @editalId
                ORDER BY cav.CAV_sigla, ss.SAR_descricao, ita.ITA_descricao
            `);
        
        res.json({
            categorias: categorias.recordset,
            pesosCategoria: pesosCategoria.recordset,
            itensAvaliacao: itensAvaliacao.recordset,
            summary: {
                totalCategorias: categorias.recordset.length,
                totalPesosCategoria: pesosCategoria.recordset.length,
                totalItensAvaliacao: itensAvaliacao.recordset.length
            }
        });
    } catch (error) {
        console.error('Erro no debug de categorias:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Busca todos os itens de avaliação do orientador disponíveis
export const getItensAvaliacaoOrientadorMaster = async (req: Request, res: Response) => {
    try {
        const sql = `
            SELECT 
                IAO_codigo as id,
                IAO_descricao as descricao
            FROM IAO_ItemAvaliacaoOrientador
            ORDER BY IAO_descricao
        `;
        const itens = await query(sql);
        res.json(itens);
    } catch (error) {
        console.error('Erro ao buscar itens de avaliação do orientador:', error);
        res.status(500).json({ message: 'Erro ao buscar itens de avaliação do orientador', error });
    }
};

// Busca todos os itens de avaliação do bolsista disponíveis
export const getItensAvaliacaoBolsistaMaster = async (req: Request, res: Response) => {
    try {
        const sql = `
            SELECT 
                IAB_codigo as id,
                IAB_descricao as descricao
            FROM IAB_ItemAvaliacaoBolsista
            ORDER BY IAB_descricao
        `;
        const itens = await query(sql);
        res.json(itens);
    } catch (error) {
        console.error('Erro ao buscar itens de avaliação do bolsista:', error);
        res.status(500).json({ message: 'Erro ao buscar itens de avaliação do bolsista', error });
    }
};

// Busca todas as categorias de relatório disponíveis
export const getCategoriasRelatorioMaster = async (req: Request, res: Response) => {
    try {
        const sql = `
            SELECT 
                CTR_codigo as id,
                CTR_descricao as descricao,
                CTR_ordem as ordem
            FROM CTR_CategoriaAvaliacaoRelatorio
            ORDER BY CTR_ordem, CTR_descricao
        `;
        const categorias = await query(sql);
        res.json(categorias);
    } catch (error) {
        console.error('Erro ao buscar categorias de relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar categorias de relatório', error });
    }
};

// Busca todos os itens de relatório disponíveis
export const getItensRelatorioMaster = async (req: Request, res: Response) => {
    try {
        const sql = `
            SELECT 
                IAR_codigo as id,
                IAR_descricao as descricao
            FROM IAR_ItemAvaliacaoRelatorio
            ORDER BY IAR_descricao
        `;
        const itens = await query(sql);
        res.json(itens);
    } catch (error) {
        console.error('Erro ao buscar itens de relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar itens de relatório', error });
    }
}; 