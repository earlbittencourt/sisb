import express from 'express';
import {
    getEventos,
    getAtividades,
    getCalendarioEdital,
    adicionarEventoCalendario,
    atualizarEventoCalendario,
    excluirEventoCalendario,
} from '../controllers/calendarioController';

const router = express.Router();

// Rotas para eventos
router.get('/eventos', getEventos);

// Rotas para atividades
router.get('/atividades/:editalId', getAtividades);

// Rotas para calendário do edital
router.get('/:editalId', getCalendarioEdital);
router.post('/', adicionarEventoCalendario);
router.put('/:id', atualizarEventoCalendario);
router.delete('/:id', excluirEventoCalendario);

export default router; 