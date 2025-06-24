import express from 'express';
import { 
    getEstruturaRelatorio,
    salvarEstruturaRelatorio
} from '../controllers/relatoriosController';

const router = express.Router();

// GET /api/estrutura-relatorio/:relatorioId
router.get('/:relatorioId', getEstruturaRelatorio);

// POST /api/estrutura-relatorio/:relatorioId
router.post('/:relatorioId', salvarEstruturaRelatorio);

export default router; 