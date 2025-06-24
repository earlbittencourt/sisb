import express from 'express';
import { getConceitos, addConceito, deleteConceito, updateConceito } from '../controllers/relatoriosController';

const router = express.Router();

// GET /api/conceitos/:relatorioId
router.get('/:relatorioId', getConceitos);

// POST /api/conceitos/:relatorioId
router.post('/:relatorioId', addConceito);

// PUT /api/conceitos/:relatorioId/:conceitoId
router.put('/:relatorioId/:conceitoId', updateConceito);

// DELETE /api/conceitos/:relatorioId/:conceitoId
router.delete('/:relatorioId/:conceitoId', deleteConceito);

export default router; 