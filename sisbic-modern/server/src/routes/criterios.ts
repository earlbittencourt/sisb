import express from 'express';
import { getCriteriosMaster } from '../controllers/relatoriosController';

const router = express.Router();

// GET /api/criterios-master
router.get('/', getCriteriosMaster);

export default router; 