import { Request, Response } from 'express';
import { query } from '../config/database';

interface InsertResult {
    id: number;
}

interface FlatEstruturaRow {
    id: number;
    categoriaId: number;
    categoriaDescricao: string;
    itemId: number;
    itemDescricao: string;
    criterioId: number | null;
    criterioDescricao: string | null;
}

interface EstruturaItem {
    id: number;
    descricao: string;
    criterios: {
        id: number;
        descricao: string;
    }[];
}

interface EstruturaCategoria {
    id: number;
    descricao: string;
    itens: EstruturaItem[];
}

interface GroupedEstrutura {
    [key: number]: EstruturaCategoria;
}

interface EstruturaToSave {
    id: number;
    descricao: string;
    itens: {
        id: number;
        descricao: string;
        criterios: {
            id: number;
            descricao: string;
        }[];
    }[];
}

interface ItemAvaliacao {
    id: number;
    descricao: string;
}

// Lista todos os relatórios (RES_RelatorioSequencia) de um edital (PEP_Codigo)
export const listarRelatorios = async (req: Request, res: Response) => {
    const { editalId } = req.params;
    try {
        const sql = `
            SELECT 
                rrs.RES_codigo as id,
                rrs.RES_codigo_PEP as editalId,
                rrs.RES_descricao as descricao,
                rrs.RES_nmAvaliadores as avaliadores,
                aa.ATI_Codigo as atividadeId,
                aa.ATI_Descricao as atividadeDescricao
            FROM RES_RelatorioSequencia rrs
            LEFT JOIN ATI_Atividade aa ON aa.ATI_codigo_PEP = rrs.RES_codigo_PEP AND aa.ATI_codigo_RES = rrs.RES_codigo
            WHERE rrs.RES_codigo_PEP = @editalId
            ORDER BY rrs.RES_codigo
        `;
        const relatorios = await query(sql, [{ name: 'editalId', value: parseInt(editalId) }]);
        res.json(relatorios);
    } catch (error) {
        console.error('Erro ao listar relatórios:', error);
        res.status(500).json({ message: 'Erro ao buscar relatórios do edital', error });
    }
};

// Cria um novo relatório
export const criarRelatorio = async (req: Request, res: Response) => {
    const { editalId } = req.params;
    const { descricao, avaliadores } = req.body;
    try {
        const sql = `
            INSERT INTO RES_RelatorioSequencia (RES_codigo_PEP, RES_descricao, RES_nmAvaliadores)
            OUTPUT INSERTED.RES_codigo as id
            VALUES (@editalId, @descricao, @avaliadores)
        `;
        const result = await query<InsertResult>(sql, [
            { name: 'editalId', value: parseInt(editalId) },
            { name: 'descricao', value: descricao },
            { name: 'avaliadores', value: avaliadores }
        ]);
        
        if (result.length > 0) {
            res.status(201).json({ 
                message: 'Relatório criado com sucesso',
                id: result[0].id 
            });
        } else {
            res.status(500).json({ message: 'Erro ao criar relatório' });
        }
    } catch (error) {
        console.error('Erro ao criar relatório:', error);
        res.status(500).json({ message: 'Erro ao criar relatório', error });
    }
};

// Busca um relatório pelo ID
export const getRelatorioById = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    try {
        const sql = `
            SELECT 
                RES_codigo as id,
                RES_codigo_PEP as editalId,
                RES_descricao as descricao,
                RES_nmAvaliadores as avaliadores
            FROM RES_RelatorioSequencia
            WHERE RES_codigo = @relatorioId
        `;
        const relatorios = await query(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        
        if (relatorios.length === 0) {
            return res.status(404).json({ message: 'Relatório não encontrado.' });
        }

        res.json(relatorios[0]);
    } catch (error) {
        console.error('Erro ao buscar relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar dados do relatório', error });
    }
};

// Busca os conceitos de um relatório
export const getConceitos = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    try {
        const sql = `
            SELECT 
                ccar.CAR_codigo as id,
                ccar.CAR_codigo_RES as relatorioId,
                ccar.CAR_descricao as descricao,
                ccar.CAR_nivel as nivel
            FROM CAR_ConceitoAvaliacaoRelatorio ccar
            WHERE ccar.CAR_codigo_RES = @relatorioId
            ORDER BY ccar.CAR_nivel, ccar.CAR_descricao
        `;
        const conceitos = await query(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        res.json(conceitos);
    } catch (error) {
        console.error('Erro ao buscar conceitos do relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar conceitos do relatório', error });
    }
};

// Adiciona um conceito a um relatório
export const addConceito = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    const { descricao, nivel } = req.body;

    if (!descricao || nivel === undefined) {
        return res.status(400).json({ message: 'Descrição e nível são obrigatórios.' });
    }

    try {
        const sql = `
            INSERT INTO CAR_ConceitoAvaliacaoRelatorio (CAR_codigo_RES, CAR_descricao, CAR_nivel)
            VALUES (@relatorioId, @descricao, @nivel);
            SELECT SCOPE_IDENTITY() AS id;
        `;
        
        const params = [
            { name: 'relatorioId', value: parseInt(relatorioId) },
            { name: 'descricao', value: descricao },
            { name: 'nivel', value: nivel }
        ];

        const result = await query<InsertResult>(sql, params);
        const novoConceitoId = result[0].id;

        res.status(201).json({ id: novoConceitoId, relatorioId: parseInt(relatorioId), descricao, nivel });
    } catch (error) {
        console.error('Erro ao adicionar conceito:', error);
        res.status(500).json({ message: 'Erro ao adicionar novo conceito', error });
    }
};

// Deleta um conceito de um relatório
export const deleteConceito = async (req: Request, res: Response) => {
    const { conceitoId } = req.params;
    try {
        const sql = `
            DELETE FROM CAR_ConceitoAvaliacaoRelatorio 
            WHERE CAR_codigo = @conceitoId
        `;
        
        await query(sql, [{ name: 'conceitoId', value: parseInt(conceitoId) }]);

        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Erro ao deletar conceito:', error);
        res.status(500).json({ message: 'Erro ao deletar conceito', error });
    }
};

// Atualiza um conceito
export const updateConceito = async (req: Request, res: Response) => {
    const { conceitoId } = req.params;
    const { descricao, nivel } = req.body;

    if (!descricao || nivel === undefined) {
        return res.status(400).json({ message: 'Descrição e nível são obrigatórios.' });
    }

    try {
        const sql = `
            UPDATE CAR_ConceitoAvaliacaoRelatorio
            SET CAR_descricao = @descricao, CAR_nivel = @nivel
            WHERE CAR_codigo = @conceitoId
        `;
        
        const params = [
            { name: 'conceitoId', value: parseInt(conceitoId) },
            { name: 'descricao', value: descricao },
            { name: 'nivel', value: nivel }
        ];

        await query(sql, params);

        res.status(200).json({ message: 'Conceito atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar conceito:', error);
        res.status(500).json({ message: 'Erro ao atualizar conceito', error });
    }
};

// Deleta um relatório
export const deleteRelatorio = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    try {
        const sql = `
            DELETE FROM RES_RelatorioSequencia 
            WHERE RES_codigo = @relatorioId
        `;
        await query(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        res.json({ message: 'Relatório deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar relatório:', error);
        res.status(500).json({ message: 'Erro ao deletar relatório', error });
    }
};

// Busca os itens de avaliação do orientador para um relatório
export const getItensOrientador = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    try {
        const sql = `
            SELECT
                iap.IAP_codigo as id,
                iao.IAO_codigo as itemId,
                iao.IAO_descricao as descricao,
                iap.IAP_variacaonota as variacaoNota
            FROM IAP_ItemAvaliacaoOrientadorPEP iap
            JOIN IAO_ItemAvaliacaoOrientador iao ON iao.IAO_codigo = iap.IAP_codigo_IAO
            WHERE iap.IAP_codigo_RES = @relatorioId
            ORDER BY iao.IAO_descricao;
        `;
        const itens = await query(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        res.json(itens);
    } catch (error) {
        console.error('Erro ao buscar itens de avaliação do orientador para o relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar itens de avaliação do orientador', error });
    }
};

// Salva a configuração de itens de avaliação do orientador para um relatório
export const salvarItensOrientador = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    const itens: { itemId: number, variacaoNota: string }[] = req.body;

    // TODO: Adicionar transação para garantir atomicidade
    try {
        // 1. Deletar itens existentes
        const deleteSql = `
            DELETE FROM IAP_ItemAvaliacaoOrientadorPEP 
            WHERE IAP_codigo_RES = @relatorioId
        `;
        await query(deleteSql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);

        // 2. Inserir novos itens
        if (itens.length > 0) {
            let insertSql = 'INSERT INTO IAP_ItemAvaliacaoOrientadorPEP (IAP_codigo_RES, IAP_codigo_IAO, IAP_variacaonota) VALUES ';
            const params: any[] = [];
            
            itens.forEach((item, index) => {
                const relatorioIdParam = `relatorioId${index}`;
                const itemIdParam = `itemId${index}`;
                const variacaoNotaParam = `variacaoNota${index}`;
                
                insertSql += `(@${relatorioIdParam}, @${itemIdParam}, @${variacaoNotaParam}),`;
                
                params.push({ name: relatorioIdParam, value: parseInt(relatorioId) });
                params.push({ name: itemIdParam, value: item.itemId });
                params.push({ name: variacaoNotaParam, value: item.variacaoNota });
            });
            
            // Remove a última vírgula e executa a query
            await query(insertSql.slice(0, -1), params);
        }

        res.status(200).json({ message: 'Configuração salva com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar itens de avaliação do orientador:', error);
        res.status(500).json({ message: 'Erro ao salvar configuração', error });
    }
};

// Busca os itens de avaliação do bolsista para um relatório
export const getItensBolsista = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    try {
        const sql = `
            SELECT
                ivp.IVP_codigo as id,
                iiab.IAB_codigo as itemId,
                iiab.IAB_descricao as descricao,
                ivp.IVP_variacaonota as variacaoNota
            FROM IVP_ItemAvaliacaoBolsistaPEP ivp
            JOIN IAB_ItemAvaliacaoBolsista iiab ON iiab.IAB_codigo = ivp.IVP_codigo_IAB
            WHERE ivp.IVP_codigo_RES = @relatorioId
            ORDER BY iiab.IAB_descricao;
        `;
        const itens = await query(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        res.json(itens);
    } catch (error) {
        console.error('Erro ao buscar itens de avaliação do bolsista para o relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar itens de avaliação do bolsista', error });
    }
};

// Salva a configuração de itens de avaliação do bolsista para um relatório
export const salvarItensBolsista = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    const itens: { itemId: number, variacaoNota: string }[] = req.body;

    // TODO: Adicionar transação para garantir atomicidade
    try {
        // 1. Deletar itens existentes
        const deleteSql = `
            DELETE FROM IVP_ItemAvaliacaoBolsistaPEP 
            WHERE IVP_codigo_RES = @relatorioId
        `;
        await query(deleteSql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);

        // 2. Inserir novos itens
        if (itens.length > 0) {
            let insertSql = 'INSERT INTO IVP_ItemAvaliacaoBolsistaPEP (IVP_codigo_RES, IVP_codigo_IAB, IVP_variacaonota) VALUES ';
            const params: any[] = [];
            
            itens.forEach((item, index) => {
                const relatorioIdParam = `relatorioId${index}`;
                const itemIdParam = `itemId${index}`;
                const variacaoNotaParam = `variacaoNota${index}`;
                
                insertSql += `(@${relatorioIdParam}, @${itemIdParam}, @${variacaoNotaParam}),`;
                
                params.push({ name: relatorioIdParam, value: parseInt(relatorioId) });
                params.push({ name: itemIdParam, value: item.itemId });
                params.push({ name: variacaoNotaParam, value: item.variacaoNota });
            });
            
            await query(insertSql.slice(0, -1), params);
        }

        res.status(200).json({ message: 'Configuração salva com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar itens de avaliação do bolsista:', error);
        res.status(500).json({ message: 'Erro ao salvar configuração', error });
    }
};

// Busca a estrutura (categorias, itens e critérios) de um relatório
export const getEstruturaRelatorio = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    try {
        const sql = `
            SELECT 
                cic.CIC_codigo as id,
                ccar.CTR_codigo as categoriaId,
                ccar.CTR_descricao as categoriaDescricao,
                iiar.IAR_codigo as itemId,
                iiar.IAR_descricao as itemDescricao,
                crr.CRR_codigo as criterioId,
                crr.CRR_descricao as criterioDescricao
            FROM CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio cic
            JOIN CTR_CategoriaAvaliacaoRelatorio ccar ON ccar.CTR_codigo = cic.CIC_codigo_CTR
            JOIN IAR_ItemAvaliacaoRelatorio iiar ON iiar.IAR_codigo = cic.CIC_codigo_IAR
            LEFT JOIN CRR_CriterioAvaliacaoRelatorio crr ON crr.CRR_codigo = cic.CIC_codigo_CRR
            WHERE cic.CIC_codigo_RES = @relatorioId
            ORDER BY ccar.CTR_descricao, iiar.IAR_descricao, crr.CRR_descricao;
        `;
        const flatStructure = await query<FlatEstruturaRow>(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        
        // Agrupa os itens e critérios por categoria
        const grouped = flatStructure.reduce<GroupedEstrutura>((acc, row) => {
            const { categoriaId, categoriaDescricao, itemId, itemDescricao, criterioId, criterioDescricao } = row;
            
            if (!acc[categoriaId]) {
                acc[categoriaId] = {
                    id: categoriaId,
                    descricao: categoriaDescricao,
                    itens: []
                };
            }

            // Verifica se o item já existe na categoria
            let item = acc[categoriaId].itens.find(i => i.id === itemId);
            if (!item) {
                item = {
                    id: itemId,
                    descricao: itemDescricao,
                    criterios: []
                };
                acc[categoriaId].itens.push(item);
            }

            // Adiciona o critério ao item se ele existir
            if (criterioId && criterioDescricao) {
                const criterioExists = item.criterios.some(c => c.id === criterioId);
                if (!criterioExists) {
                    item.criterios.push({
                        id: criterioId,
                        descricao: criterioDescricao
                    });
                }
            }

            return acc;
        }, {});

        res.json(Object.values(grouped));
    } catch (error) {
        console.error('Erro ao buscar estrutura do relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar estrutura do relatório', error });
    }
};

// Salva a estrutura de um relatório
export const salvarEstruturaRelatorio = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    const estrutura: EstruturaToSave[] = req.body;

    try {
        // 1. Deletar estrutura existente
        const deleteSql = `
            DELETE FROM CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio
            WHERE CIC_codigo_RES = @relatorioId
        `;
        await query(deleteSql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);

        // 2. Inserir nova estrutura
        if (estrutura.length > 0) {
            let insertSql = 'INSERT INTO CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio (CIC_codigo_RES, CIC_codigo_CTR, CIC_codigo_IAR, CIC_codigo_CRR) VALUES ';
            const params: any[] = [];
            let paramIndex = 0;

            estrutura.forEach(categoria => {
                categoria.itens.forEach(item => {
                    if (item.criterios.length > 0) {
                        item.criterios.forEach(criterio => {
                            const relatorioIdParam = `relatorioId${paramIndex}`;
                            const categoriaIdParam = `categoriaId${paramIndex}`;
                            const itemIdParam = `itemId${paramIndex}`;
                            const criterioIdParam = `criterioId${paramIndex}`;

                            insertSql += `(@${relatorioIdParam}, @${categoriaIdParam}, @${itemIdParam}, @${criterioIdParam}),`;

                            params.push({ name: relatorioIdParam, value: parseInt(relatorioId) });
                            params.push({ name: categoriaIdParam, value: categoria.id });
                            params.push({ name: itemIdParam, value: item.id });
                            params.push({ name: criterioIdParam, value: criterio.id });
                            paramIndex++;
                        });
                    } else {
                        // Se não houver critérios, insere com critério NULL
                        const relatorioIdParam = `relatorioId${paramIndex}`;
                        const categoriaIdParam = `categoriaId${paramIndex}`;
                        const itemIdParam = `itemId${paramIndex}`;

                        insertSql += `(@${relatorioIdParam}, @${categoriaIdParam}, @${itemIdParam}, NULL),`;

                        params.push({ name: relatorioIdParam, value: parseInt(relatorioId) });
                        params.push({ name: categoriaIdParam, value: categoria.id });
                        params.push({ name: itemIdParam, value: item.id });
                        paramIndex++;
                    }
                });
            });

            if (params.length > 0) {
                await query(insertSql.slice(0, -1), params);
            }
        }

        res.status(200).json({ message: 'Estrutura salva com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar estrutura do relatório:', error);
        res.status(500).json({ message: 'Erro ao salvar estrutura do relatório', error });
    }
};

// NOVOS MÉTODOS PARA ITENS ORIENTADOR
export const adicionarItemOrientador = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    const { itemId, variacaoNota } = req.body;
    try {
        const sql = `INSERT INTO IAP_ItemAvaliacaoOrientadorPEP (IAP_codigo_RES, IAP_codigo_IAO, IAP_variacaonota) VALUES (@relatorioId, @itemId, @variacaoNota)`;
        await query(sql, [
            { name: 'relatorioId', value: parseInt(relatorioId) },
            { name: 'itemId', value: itemId },
            { name: 'variacaoNota', value: variacaoNota }
        ]);
        res.status(200).json({ message: 'Item adicionado com sucesso.' });
    } catch (error) {
        console.error('Erro ao adicionar item de avaliação do orientador:', error);
        res.status(500).json({ message: 'Erro ao adicionar item', error });
    }
};

export const atualizarItemOrientador = async (req: Request, res: Response) => {
    const { relatorioId, itemId } = req.params;
    const { variacaoNota } = req.body;
    try {
        const sql = `UPDATE IAP_ItemAvaliacaoOrientadorPEP SET IAP_variacaonota = @variacaoNota WHERE IAP_codigo_RES = @relatorioId AND IAP_codigo_IAO = @itemId`;
        await query(sql, [
            { name: 'variacaoNota', value: variacaoNota },
            { name: 'relatorioId', value: parseInt(relatorioId) },
            { name: 'itemId', value: itemId }
        ]);
        res.status(200).json({ message: 'Item atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar item de avaliação do orientador:', error);
        res.status(500).json({ message: 'Erro ao atualizar item', error });
    }
};

export const removerItemOrientador = async (req: Request, res: Response) => {
    const { relatorioId, itemId } = req.params;
    try {
        const sql = `DELETE FROM IAP_ItemAvaliacaoOrientadorPEP WHERE IAP_codigo_RES = @relatorioId AND IAP_codigo_IAO = @itemId`;
        await query(sql, [
            { name: 'relatorioId', value: parseInt(relatorioId) },
            { name: 'itemId', value: itemId }
        ]);
        res.status(200).json({ message: 'Item removido com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover item de avaliação do orientador:', error);
        res.status(500).json({ message: 'Erro ao remover item', error });
    }
};

// NOVOS MÉTODOS PARA ITENS BOLSISTA
export const adicionarItemBolsista = async (req: Request, res: Response) => {
    const { relatorioId } = req.params;
    const { itemId, variacaoNota } = req.body;
    try {
        const sql = `INSERT INTO IVP_ItemAvaliacaoBolsistaPEP (IVP_codigo_RES, IVP_codigo_IAB, IVP_variacaonota) VALUES (@relatorioId, @itemId, @variacaoNota)`;
        await query(sql, [
            { name: 'relatorioId', value: parseInt(relatorioId) },
            { name: 'itemId', value: itemId },
            { name: 'variacaoNota', value: variacaoNota }
        ]);
        res.status(200).json({ message: 'Item adicionado com sucesso.' });
    } catch (error) {
        console.error('Erro ao adicionar item de avaliação do bolsista:', error);
        res.status(500).json({ message: 'Erro ao adicionar item', error });
    }
};

export const atualizarItemBolsista = async (req: Request, res: Response) => {
    const { relatorioId, itemId } = req.params;
    const { variacaoNota } = req.body;

    console.log('atualizarItemBolsista - Request:', {
        params: req.params,
        body: req.body,
        path: req.path,
        url: req.url,
        method: req.method
    });

    // Validações
    if (!relatorioId || !itemId) {
        console.error('atualizarItemBolsista - Parâmetros inválidos:', { relatorioId, itemId });
        return res.status(400).json({ message: 'ID do relatório e ID do item são obrigatórios.' });
    }

    if (variacaoNota === undefined) {
        console.error('atualizarItemBolsista - Variação da nota não fornecida');
        return res.status(400).json({ message: 'Variação da nota é obrigatória.' });
    }

    try {
        // Primeiro verifica se o item existe
        const checkSql = `
            SELECT COUNT(*) as count 
            FROM IVP_ItemAvaliacaoBolsistaPEP 
            WHERE IVP_codigo_RES = @relatorioId AND IVP_codigo_IAB = @itemId
        `;
        console.log('atualizarItemBolsista - Check SQL:', checkSql);
        console.log('atualizarItemBolsista - Check Params:', {
            relatorioId: parseInt(relatorioId),
            itemId: parseInt(itemId)
        });
        
        const checkResult = await query<{ count: number }>(checkSql, [
            { name: 'relatorioId', value: parseInt(relatorioId) },
            { name: 'itemId', value: parseInt(itemId) }
        ]);
        
        console.log('atualizarItemBolsista - Check Result:', checkResult);

        if (!checkResult || checkResult.length === 0 || checkResult[0].count === 0) {
            console.error('atualizarItemBolsista - Item não encontrado');
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        const updateSql = `
            UPDATE IVP_ItemAvaliacaoBolsistaPEP 
            SET IVP_variacaonota = @variacaoNota 
            WHERE IVP_codigo_RES = @relatorioId AND IVP_codigo_IAB = @itemId
        `;
        console.log('atualizarItemBolsista - Update SQL:', updateSql);
        console.log('atualizarItemBolsista - Update Params:', {
            variacaoNota,
            relatorioId: parseInt(relatorioId),
            itemId: parseInt(itemId)
        });
        
        await query(updateSql, [
            { name: 'variacaoNota', value: variacaoNota },
            { name: 'relatorioId', value: parseInt(relatorioId) },
            { name: 'itemId', value: parseInt(itemId) }
        ]);

        console.log('atualizarItemBolsista - Update realizado com sucesso');
        res.status(200).json({ message: 'Item atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar item de avaliação do bolsista:', error);
        res.status(500).json({ message: 'Erro ao atualizar item', error });
    }
};

export const removerItemBolsista = async (req: Request, res: Response) => {
    const { relatorioId, itemId } = req.params;
    try {
        const sql = `DELETE FROM IVP_ItemAvaliacaoBolsistaPEP WHERE IVP_codigo_RES = @relatorioId AND IVP_codigo_IAB = @itemId`;
        await query(sql, [
            { name: 'relatorioId', value: parseInt(relatorioId) },
            { name: 'itemId', value: itemId }
        ]);
        res.status(200).json({ message: 'Item removido com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover item de avaliação do bolsista:', error);
        res.status(500).json({ message: 'Erro ao remover item', error });
    }
};

// Busca os critérios master
export const getCriteriosMaster = async (req: Request, res: Response) => {
    try {
        const sql = `
            SELECT 
                CRR_codigo as id,
                CRR_descricao as descricao
            FROM CRR_CriterioAvaliacaoRelatorio
            ORDER BY CRR_descricao;
        `;
        const criterios = await query<ItemAvaliacao>(sql);
        res.json(criterios);
    } catch (error) {
        console.error('Erro ao buscar critérios master:', error);
        res.status(500).json({ message: 'Erro ao buscar critérios master', error });
    }
}; 