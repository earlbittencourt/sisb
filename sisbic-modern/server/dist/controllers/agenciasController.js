"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarAgencias = void 0;
const database_1 = require("../config/database");
// Lista todas as agências de fomento disponíveis
const listarAgencias = async (req, res) => {
    try {
        const pool = await (0, database_1.connectToDatabase)();
        const result = await pool.request().query('SELECT AGE_Codigo, AGE_Descricao, AGE_Sigla FROM AGE_AgenciaFinanciadora');
        res.status(200).json(result.recordset);
    }
    catch (error) {
        console.error('Erro ao buscar agências de fomento:', error);
        res.status(500).send('Erro ao buscar agências de fomento.');
    }
};
exports.listarAgencias = listarAgencias;
