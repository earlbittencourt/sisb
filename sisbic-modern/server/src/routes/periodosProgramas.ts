import { Router } from 'express';
import {
  getPeriodosProgramas,
  getPeriodoProgramaById,
  updatePeriodoPrograma,
  deletePeriodoPrograma,
  listarAgenciasPorEdital,
  adicionarAgenciaEdital,
  updateAgenciaEdital,
  deleteAgenciaEdital,
  getProjetoConfiguracao,
  upsertProjetoConfiguracao,
  criarPeriodoPrograma,
} from '../controllers/periodosProgramasController';
import relatoriosRoutes from './relatorios';

const router = Router();

router.get('/', getPeriodosProgramas);
router.get('/:id', getPeriodoProgramaById);
router.put('/:id', updatePeriodoPrograma);
router.delete('/:id', deletePeriodoPrograma);

// Rotas para agências de um edital
router.get('/:id/agencias', listarAgenciasPorEdital);
router.post('/:id/agencias', adicionarAgenciaEdital);
router.put('/:id/agencias/:agenciaId', updateAgenciaEdital);
router.delete('/:id/agencias/:agenciaId', deleteAgenciaEdital);

// Rotas para configuração de submissão do edital
router.get('/:id/configuracao-submissao', getProjetoConfiguracao);
router.post('/:id/configuracao-submissao', upsertProjetoConfiguracao);

// Rotas para relatórios de um edital
router.use('/:id/relatorios', relatoriosRoutes);

router.post('/', criarPeriodoPrograma);

export default router; 