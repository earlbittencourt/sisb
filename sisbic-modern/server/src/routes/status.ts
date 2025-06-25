import { Router } from 'express';
import { listarStatus } from '../controllers/statusController';

const router = Router();

router.get('/', listarStatus);

export default router; 