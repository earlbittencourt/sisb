"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarStatus = listarStatus;
const database_1 = require("../config/database");
async function listarStatus(req, res) {
    try {
        const status = await (0, database_1.query)('SELECT PPS_Codigo, PPS_Descricao FROM PPS_PeriodoProgramaStatus ORDER BY PPS_Descricao');
        res.json(status);
    }
    catch (error) {
        console.error('Erro ao listar status:', error);
        res.status(500).json({ error: 'Erro ao listar status' });
    }
}
