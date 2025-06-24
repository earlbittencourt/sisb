import express from 'express';
import { 
    listarRelatorios, 
    criarRelatorio, 
    deleteRelatorio,
    getRelatorioById
} from '../controllers/relatoriosController';

const router = express.Router();

// Rota para listar relatórios de um edital específico
// GET /api/relatorios/:editalId
router.get('/:editalId', listarRelatorios);

// Rota para criar um novo relatório para um edital
// POST /api/relatorios/:editalId
router.post('/:editalId', criarRelatorio);

// Rota para buscar um relatório específico pelo ID
// GET /api/relatorios/:editalId/:relatorioId
router.get('/:editalId/:relatorioId', getRelatorioById);

// Rota para deletar um relatório específico
// DELETE /api/relatorios/:editalId/:relatorioId
router.delete('/:editalId/:relatorioId', deleteRelatorio);

export default router; 