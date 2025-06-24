import { Router } from 'express';
import { listarProgramas } from '../controllers/programasController';

const router = Router();

router.get('/', listarProgramas);

export default router; 