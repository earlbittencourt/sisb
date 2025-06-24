import express from 'express';
import { 
    getItensBolsista,
    adicionarItemBolsista,
    atualizarItemBolsista,
    removerItemBolsista
} from '../controllers/relatoriosController';

const router = express.Router();

// GET /api/itens-bolsista/:relatorioId
router.get('/:relatorioId', getItensBolsista);

// POST /api/itens-bolsista/:relatorioId/adicionar
router.post('/:relatorioId/adicionar', adicionarItemBolsista);

// PUT /api/itens-bolsista/:relatorioId/:itemId
router.put('/:relatorioId/:itemId', atualizarItemBolsista);

// DELETE /api/itens-bolsista/:relatorioId/:itemId
router.delete('/:relatorioId/:itemId', removerItemBolsista);

export default router; 