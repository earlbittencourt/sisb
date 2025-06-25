import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connectToDatabase } from './config/database';
import periodosProgramasRoutes from './routes/periodosProgramas';
import programasRoutes from './routes/programas';
import statusRoutes from './routes/status';
import agenciasRoutes from './routes/agencias';
import avaliacaoRoutes from './routes/avaliacao';
import calendarioRoutes from './routes/calendario';
import relatoriosRoutes from './routes/relatorios';
import conceitosRoutes from './routes/conceitos';
import itensOrientadorRoutes from './routes/itensOrientador';
import itensBolsistaRoutes from './routes/itensBolsista';
import estruturaRelatorioRoutes from './routes/estruturaRelatorio';
import criteriosRoutes from './routes/criterios';

config();

const app = express();
const port = process.env.PORT || 3001;

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para parsing do body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging global
app.use((req, res, next) => {
  console.log('Request recebida:', {
    method: req.method,
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    path: req.path,
    params: req.params,
    body: req.body
  });
  next();
});

// Rotas
app.use('/api/periodos-programas', periodosProgramasRoutes);
app.use('/api/programas', programasRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/agencias', agenciasRoutes);
app.use('/api/avaliacao', avaliacaoRoutes);
app.use('/api/calendario', calendarioRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/conceitos', conceitosRoutes);
app.use('/api/itens-orientador', itensOrientadorRoutes);
app.use('/api/itens-bolsista', itensBolsistaRoutes);
app.use('/api/estrutura-relatorio', estruturaRelatorioRoutes);
app.use('/api/criterios-master', criteriosRoutes);

// Teste de conexão com o banco
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }); 