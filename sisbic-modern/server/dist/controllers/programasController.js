"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarProgramas = listarProgramas;
const database_1 = require("../config/database");
async function listarProgramas(req, res) {
    try {
        const programas = await (0, database_1.query)('SELECT PRO_Codigo, PRO_Descricao, PRO_Sigla FROM PRO_Programa ORDER BY PRO_Descricao');
        res.json(programas);
    }
    catch (error) {
        console.error('Erro ao listar programas:', error);
        res.status(500).json({ error: 'Erro ao listar programas' });
    }
}
