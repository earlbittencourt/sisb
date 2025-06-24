"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.excluirEventoCalendario = exports.atualizarEventoCalendario = exports.adicionarEventoCalendario = exports.getCalendarioEdital = exports.getAtividades = exports.getEventos = void 0;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../config/database");
// Buscar todos os eventos disponíveis
const getEventos = async (req, res) => {
    try {
        const pool = await (0, database_1.connectToDatabase)();
        const result = await pool.request()
            .query(`
                SELECT 
                    EVE_Codigo as id,
                    EVE_Descricao as descricao
                FROM EVE_Evento
                ORDER BY EVE_Descricao
            `);
        res.json(result.recordset);
    }
    catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getEventos = getEventos;
// Buscar todas as atividades disponíveis
const getAtividades = async (req, res) => {
    try {
        const { editalId } = req.params;
        const pool = await (0, database_1.connectToDatabase)();
        const result = await pool.request()
            .input('editalId', mssql_1.default.Int, editalId)
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
    }
    catch (error) {
        console.error('Erro ao buscar atividades:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getAtividades = getAtividades;
// Buscar calendário completo de um edital, AGRUPADO por atividade
const getCalendarioEdital = async (req, res) => {
    try {
        const { editalId } = req.params;
        const pool = await (0, database_1.connectToDatabase)();
        const result = await pool.request()
            .input('editalId', mssql_1.default.Int, editalId)
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
        const calendarioAgrupado = new Map();
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
    }
    catch (error) {
        console.error('Erro ao buscar calendário do edital:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getCalendarioEdital = getCalendarioEdital;
// Adicionar novo evento/atividade ao calendário
const adicionarEventoCalendario = async (req, res) => {
    try {
        const { editalId, eventoId, atividadeId, dataInicio, dataFim, dataFimProrrogacao, usuario } = req.body;
        const pool = await (0, database_1.connectToDatabase)();
        const result = await pool.request()
            .input('editalId', mssql_1.default.Int, editalId)
            .input('eventoId', mssql_1.default.Int, eventoId || null)
            .input('atividadeId', mssql_1.default.Int, atividadeId || null)
            .input('dataInicio', mssql_1.default.DateTime, new Date(dataInicio))
            .input('dataFim', mssql_1.default.DateTime, new Date(dataFim))
            .input('dataFimProrrogacao', mssql_1.default.DateTime, dataFimProrrogacao ? new Date(dataFimProrrogacao) : null)
            .input('usuario', mssql_1.default.VarChar(25), usuario || null)
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
    }
    catch (error) {
        console.error('Erro ao adicionar evento ao calendário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.adicionarEventoCalendario = adicionarEventoCalendario;
// Atualizar evento/atividade do calendário
const atualizarEventoCalendario = async (req, res) => {
    try {
        const { id } = req.params;
        const { eventoId, atividadeId, dataInicio, dataFim, dataFimProrrogacao, usuario } = req.body;
        const pool = await (0, database_1.connectToDatabase)();
        await pool.request()
            .input('id', mssql_1.default.Int, id)
            .input('eventoId', mssql_1.default.Int, eventoId || null)
            .input('atividadeId', mssql_1.default.Int, atividadeId || null)
            .input('dataInicio', mssql_1.default.DateTime, new Date(dataInicio))
            .input('dataFim', mssql_1.default.DateTime, new Date(dataFim))
            .input('dataFimProrrogacao', mssql_1.default.DateTime, dataFimProrrogacao ? new Date(dataFimProrrogacao) : null)
            .input('usuario', mssql_1.default.VarChar(25), usuario || null)
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
    }
    catch (error) {
        console.error('Erro ao atualizar evento do calendário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.atualizarEventoCalendario = atualizarEventoCalendario;
// Excluir evento/atividade do calendário
const excluirEventoCalendario = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await (0, database_1.connectToDatabase)();
        await pool.request()
            .input('id', mssql_1.default.Int, id)
            .query(`
                DELETE FROM EVA_EventoAtividadePEP
                WHERE EVA_Codigo = @id
            `);
        res.json({ message: 'Evento/atividade excluído com sucesso' });
    }
    catch (error) {
        console.error('Erro ao excluir evento do calendário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.excluirEventoCalendario = excluirEventoCalendario;
