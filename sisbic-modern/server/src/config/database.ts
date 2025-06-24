import { config } from 'dotenv';
import sql from 'mssql';

config();

// TODO: Investigar por que a conexão falha ao usar o hostname mas funciona com IP
// - O ping para mssql_desen01.intranet.ufba.br funciona
// - O DBeaver conecta usando o hostname
// - O Node.js só conecta usando IP direto
// Possíveis causas:
// - Configuração específica do driver JDBC no DBeaver
// - Problema de DNS com o driver Node.js
// - Configurações de TLS/SSL
const dbConfig: sql.config = {
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

let pool: sql.ConnectionPool | null = null;

export async function connectToDatabase() {
  try {
    if (pool) {
      return pool;
    }
    
    console.log('Tentando conectar ao banco de dados...');
    console.log('Configuração:', {
      ...dbConfig,
      password: '****'
    });
    
    pool = await sql.connect(dbConfig);
    console.log('Conectado ao banco de dados com sucesso!');
    return pool;
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
}

export async function query<T>(queryString: string, params?: any[]): Promise<T[]> {
  try {
    const connectionPool = await connectToDatabase();
    const result = await connectionPool.request();
    
    if (params) {
      params.forEach((param) => {
        if (typeof param === 'object' && param.name && param.value !== undefined) {
          // Parâmetro nomeado: { name: 'editalId', value: 123 }
          result.input(param.name, param.value);
        } else {
          // Parâmetro posicional: valor direto
          result.input(`param${params.indexOf(param)}`, param);
        }
      });
    }
    
    const data = await result.query(queryString);
    return data.recordset;
  } catch (err) {
    console.error('Erro ao executar query:', err);
    throw err;
  }
}

export { sql }; 