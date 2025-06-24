import { Router } from 'express';
import { listarAgencias } from '../controllers/agenciasController';

const router = Router();

// Rota para buscar todas as agências de fomento
router.get('/', listarAgencias);

export default router; 