"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
exports.connectToDatabase = connectToDatabase;
exports.query = query;
const dotenv_1 = require("dotenv");
const mssql_1 = __importDefault(require("mssql"));
exports.sql = mssql_1.default;
(0, dotenv_1.config)();
// TODO: Investigar por que a conexão falha ao usar o hostname mas funciona com IP
// - O ping para mssql_desen01.intranet.ufba.br funciona
// - O DBeaver conecta usando o hostname
// - O Node.js só conecta usando IP direto
// Possíveis causas:
// - Configuração específica do driver JDBC no DBeaver
// - Problema de DNS com o driver Node.js
// - Configurações de TLS/SSL
const dbConfig = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD,
    database: 'pibicdb',
    server: '10.0.2.28', // IP do mssql_desen01.intranet.ufba.br
    options: {
        encrypt: false,
        trustServerCertificate: false,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200
    }
};
let pool = null;
async function connectToDatabase() {
    try {
        if (pool) {
            return pool;
        }
        console.log('Tentando conectar ao banco de dados...');
        console.log('Configuração:', {
            ...dbConfig,
            password: '****'
        });
        pool = await mssql_1.default.connect(dbConfig);
        console.log('Conectado ao banco de dados com sucesso!');
        return pool;
    }
    catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
}
async function query(queryString, params) {
    try {
        const connectionPool = await connectToDatabase();
        const result = await connectionPool.request();
        if (params) {
            params.forEach((param) => {
                if (typeof param === 'object' && param.name && param.value !== undefined) {
                    // Parâmetro nomeado: { name: 'editalId', value: 123 }
                    result.input(param.name, param.value);
                }
                else {
                    // Parâmetro posicional: valor direto
                    result.input(`param${params.indexOf(param)}`, param);
                }
            });
        }
        const data = await result.query(queryString);
        return data.recordset;
    }
    catch (err) {
        console.error('Erro ao executar query:', err);
        throw err;
    }
}
