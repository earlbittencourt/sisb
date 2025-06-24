"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salvarEstruturaRelatorio = exports.getEstruturaRelatorio = exports.salvarItensBolsista = exports.getItensBolsista = exports.salvarItensOrientador = exports.getItensOrientador = exports.deleteRelatorio = exports.deleteConceito = exports.addConceito = exports.getConceitos = exports.getRelatorioById = exports.criarRelatorio = exports.listarRelatorios = void 0;
const database_1 = require("../config/database");
// Lista todos os relatórios (RES_RelatorioSequencia) de um edital (PEP_Codigo)
const listarRelatorios = async (req, res) => {
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
        const relatorios = await (0, database_1.query)(sql, [{ name: 'editalId', value: parseInt(editalId) }]);
        res.json(relatorios);
    }
    catch (error) {
        console.error('Erro ao listar relatórios:', error);
        res.status(500).json({ message: 'Erro ao buscar relatórios do edital', error });
    }
};
exports.listarRelatorios = listarRelatorios;
// Cria um novo relatório
const criarRelatorio = async (req, res) => {
    const { editalId } = req.params;
    const { descricao, avaliadores } = req.body;
    try {
        const sql = `
            INSERT INTO RES_RelatorioSequencia (RES_codigo_PEP, RES_descricao, RES_nmAvaliadores)
            OUTPUT INSERTED.RES_codigo as id
            VALUES (@editalId, @descricao, @avaliadores)
        `;
        const result = await (0, database_1.query)(sql, [
            { name: 'editalId', value: parseInt(editalId) },
            { name: 'descricao', value: descricao },
            { name: 'avaliadores', value: avaliadores }
        ]);
        if (result.length > 0) {
            res.status(201).json({
                message: 'Relatório criado com sucesso',
                id: result[0].id
            });
        }
        else {
            res.status(500).json({ message: 'Erro ao criar relatório' });
        }
    }
    catch (error) {
        console.error('Erro ao criar relatório:', error);
        res.status(500).json({ message: 'Erro ao criar relatório', error });
    }
};
exports.criarRelatorio = criarRelatorio;
// Busca um relatório pelo ID
const getRelatorioById = async (req, res) => {
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
        const relatorios = await (0, database_1.query)(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        if (relatorios.length === 0) {
            return res.status(404).json({ message: 'Relatório não encontrado.' });
        }
        res.json(relatorios[0]);
    }
    catch (error) {
        console.error('Erro ao buscar relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar dados do relatório', error });
    }
};
exports.getRelatorioById = getRelatorioById;
// Busca os conceitos de um relatório
const getConceitos = async (req, res) => {
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
        const conceitos = await (0, database_1.query)(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        res.json(conceitos);
    }
    catch (error) {
        console.error('Erro ao buscar conceitos do relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar conceitos do relatório', error });
    }
};
exports.getConceitos = getConceitos;
// Adiciona um conceito a um relatório
const addConceito = async (req, res) => {
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
        const result = await (0, database_1.query)(sql, params);
        const novoConceitoId = result[0].id;
        res.status(201).json({ id: novoConceitoId, relatorioId: parseInt(relatorioId), descricao, nivel });
    }
    catch (error) {
        console.error('Erro ao adicionar conceito:', error);
        res.status(500).json({ message: 'Erro ao adicionar novo conceito', error });
    }
};
exports.addConceito = addConceito;
// Deleta um conceito de um relatório
const deleteConceito = async (req, res) => {
    const { conceitoId } = req.params;
    try {
        const sql = `
            DELETE FROM CAR_ConceitoAvaliacaoRelatorio 
            WHERE CAR_codigo = @conceitoId
        `;
        await (0, database_1.query)(sql, [{ name: 'conceitoId', value: parseInt(conceitoId) }]);
        res.status(204).send(); // No Content
    }
    catch (error) {
        console.error('Erro ao deletar conceito:', error);
        res.status(500).json({ message: 'Erro ao deletar conceito', error });
    }
};
exports.deleteConceito = deleteConceito;
// Deleta um relatório
const deleteRelatorio = async (req, res) => {
    const { relatorioId } = req.params;
    try {
        const sql = `
            DELETE FROM RES_RelatorioSequencia 
            WHERE RES_codigo = @relatorioId
        `;
        await (0, database_1.query)(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        res.json({ message: 'Relatório deletado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar relatório:', error);
        res.status(500).json({ message: 'Erro ao deletar relatório', error });
    }
};
exports.deleteRelatorio = deleteRelatorio;
// Busca os itens de avaliação do orientador para um relatório
const getItensOrientador = async (req, res) => {
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
        const itens = await (0, database_1.query)(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        res.json(itens);
    }
    catch (error) {
        console.error('Erro ao buscar itens de avaliação do orientador para o relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar itens de avaliação do orientador', error });
    }
};
exports.getItensOrientador = getItensOrientador;
// Salva a configuração de itens de avaliação do orientador para um relatório
const salvarItensOrientador = async (req, res) => {
    const { relatorioId } = req.params;
    const itens = req.body;
    // TODO: Adicionar transação para garantir atomicidade
    try {
        // 1. Deletar itens existentes
        const deleteSql = `
            DELETE FROM IAP_ItemAvaliacaoOrientadorPEP 
            WHERE IAP_codigo_RES = @relatorioId
        `;
        await (0, database_1.query)(deleteSql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        // 2. Inserir novos itens
        if (itens.length > 0) {
            let insertSql = 'INSERT INTO IAP_ItemAvaliacaoOrientadorPEP (IAP_codigo_RES, IAP_codigo_IAO, IAP_variacaonota) VALUES ';
            const params = [];
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
            await (0, database_1.query)(insertSql.slice(0, -1), params);
        }
        res.status(200).json({ message: 'Configuração salva com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao salvar itens de avaliação do orientador:', error);
        res.status(500).json({ message: 'Erro ao salvar configuração', error });
    }
};
exports.salvarItensOrientador = salvarItensOrientador;
// Busca os itens de avaliação do bolsista para um relatório
const getItensBolsista = async (req, res) => {
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
        const itens = await (0, database_1.query)(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        res.json(itens);
    }
    catch (error) {
        console.error('Erro ao buscar itens de avaliação do bolsista para o relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar itens de avaliação do bolsista', error });
    }
};
exports.getItensBolsista = getItensBolsista;
// Salva a configuração de itens de avaliação do bolsista para um relatório
const salvarItensBolsista = async (req, res) => {
    const { relatorioId } = req.params;
    const itens = req.body;
    // TODO: Adicionar transação para garantir atomicidade
    try {
        // 1. Deletar itens existentes
        const deleteSql = `
            DELETE FROM IVP_ItemAvaliacaoBolsistaPEP 
            WHERE IVP_codigo_RES = @relatorioId
        `;
        await (0, database_1.query)(deleteSql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        // 2. Inserir novos itens
        if (itens.length > 0) {
            let insertSql = 'INSERT INTO IVP_ItemAvaliacaoBolsistaPEP (IVP_codigo_RES, IVP_codigo_IAB, IVP_variacaonota) VALUES ';
            const params = [];
            itens.forEach((item, index) => {
                const relatorioIdParam = `relatorioId${index}`;
                const itemIdParam = `itemId${index}`;
                const variacaoNotaParam = `variacaoNota${index}`;
                insertSql += `(@${relatorioIdParam}, @${itemIdParam}, @${variacaoNotaParam}),`;
                params.push({ name: relatorioIdParam, value: parseInt(relatorioId) });
                params.push({ name: itemIdParam, value: item.itemId });
                params.push({ name: variacaoNotaParam, value: item.variacaoNota });
            });
            await (0, database_1.query)(insertSql.slice(0, -1), params);
        }
        res.status(200).json({ message: 'Configuração salva com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao salvar itens de avaliação do bolsista:', error);
        res.status(500).json({ message: 'Erro ao salvar configuração', error });
    }
};
exports.salvarItensBolsista = salvarItensBolsista;
// Busca a estrutura (categorias e itens) de um relatório
const getEstruturaRelatorio = async (req, res) => {
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
            JOIN CRR_CriterioAvaliacaoRelatorio crr ON crr.CRR_codigo = cic.CIC_codigo_CRR
            WHERE cic.CIC_codigo_RES = @relatorioId
            ORDER BY ccar.CTR_descricao, iiar.IAR_descricao, crr.CRR_descricao;
        `;
        const flatStructure = await (0, database_1.query)(sql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        // Agrupa os itens por categoria
        const grouped = flatStructure.reduce((acc, row) => {
            const { categoriaId, categoriaDescricao, itemId, itemDescricao } = row;
            if (!acc[categoriaId]) {
                acc[categoriaId] = {
                    id: categoriaId,
                    descricao: categoriaDescricao,
                    itens: []
                };
            }
            // Verifica se o item já existe na categoria
            const itemExists = acc[categoriaId].itens.some(item => item.id === itemId);
            if (!itemExists) {
                acc[categoriaId].itens.push({ id: itemId, descricao: itemDescricao });
            }
            return acc;
        }, {});
        res.json(Object.values(grouped));
    }
    catch (error) {
        console.error('Erro ao buscar estrutura do relatório:', error);
        res.status(500).json({ message: 'Erro ao buscar estrutura do relatório', error });
    }
};
exports.getEstruturaRelatorio = getEstruturaRelatorio;
// Salva a estrutura de um relatório
const salvarEstruturaRelatorio = async (req, res) => {
    const { relatorioId } = req.params;
    const estrutura = req.body;
    try {
        // 1. Deletar estrutura existente
        const deleteSql = `
            DELETE FROM CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio
            WHERE CIC_codigo_RES = @relatorioId
        `;
        await (0, database_1.query)(deleteSql, [{ name: 'relatorioId', value: parseInt(relatorioId) }]);
        // 2. Inserir nova estrutura
        if (estrutura.length > 0) {
            let insertSql = 'INSERT INTO CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio (CIC_codigo_RES, CIC_codigo_CTR, CIC_codigo_IAR) VALUES ';
            const params = [];
            let paramIndex = 0;
            estrutura.forEach(categoria => {
                categoria.itens.forEach(item => {
                    const relatorioIdParam = `relatorioId${paramIndex}`;
                    const categoriaIdParam = `categoriaId${paramIndex}`;
                    const itemIdParam = `itemId${paramIndex}`;
                    insertSql += `(@${relatorioIdParam}, @${categoriaIdParam}, @${itemIdParam}),`;
                    params.push({ name: relatorioIdParam, value: parseInt(relatorioId) });
                    params.push({ name: categoriaIdParam, value: categoria.id });
                    params.push({ name: itemIdParam, value: item.id });
                    paramIndex++;
                });
            });
            if (params.length > 0) {
                await (0, database_1.query)(insertSql.slice(0, -1), params);
            }
        }
        res.status(200).json({ message: 'Estrutura salva com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao salvar estrutura do relatório:', error);
        res.status(500).json({ message: 'Erro ao salvar estrutura do relatório', error });
    }
};
exports.salvarEstruturaRelatorio = salvarEstruturaRelatorio;
