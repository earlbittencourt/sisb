import express from 'express';
import { 
    getItensOrientador,
    adicionarItemOrientador,
    atualizarItemOrientador,
    removerItemOrientador
} from '../controllers/relatoriosController';

const router = express.Router();

// GET /api/itens-orientador/:relatorioId
router.get('/:relatorioId', getItensOrientador);

// POST /api/itens-orientador/:relatorioId/adicionar
router.post('/:relatorioId/adicionar', adicionarItemOrientador);

// PUT /api/itens-orientador/:relatorioId/:itemId
router.put('/:relatorioId/:itemId', atualizarItemOrientador);

// DELETE /api/itens-orientador/:relatorioId/:itemId
router.delete('/:relatorioId/:itemId', removerItemOrientador);

export default router; 