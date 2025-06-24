import express from 'express';
import {
    getCriteriosProjeto,
    getPesosCriteriosProjeto,
    salvarPesoCriterio,
    getSubAreas,
    getCategoriasAvaliacao,
    getCategoriasCompletas,
    getItensAvaliacao,
    getPesosItensAvaliacao,
    salvarPesoItem,
    getDisponiveisCriteriosProjeto,
    createCriterioProjeto,
    removerCriterioProjeto,
    debugCategorias,
    getAreasComSubareas,
    getCriteriosPorSubarea,
    getItensAvaliacaoOrientadorMaster,
    getItensAvaliacaoBolsistaMaster,
    getCategoriasRelatorioMaster,
    getItensRelatorioMaster
} from '../controllers/avaliacaoController';

const router = express.Router();

// Rotas para Avaliação de Projeto
router.get('/criterios-projeto/disponiveis/:editalId', getDisponiveisCriteriosProjeto);
router.get('/criterios-projeto/:editalId', getCriteriosProjeto);
router.get('/criterios-projeto/:editalId/pesos', getPesosCriteriosProjeto);
router.post('/criterios-projeto/:editalId/peso', salvarPesoCriterio);
router.post('/criterios-projeto', createCriterioProjeto);
router.delete('/criterios-projeto/:editalId/:criterioId', removerCriterioProjeto);

// Rotas para categorias de avaliação
router.get('/categorias/:editalId', getCategoriasAvaliacao);
router.get('/categorias/:editalId/completas', getCategoriasCompletas);
router.get('/categorias/:editalId/debug', debugCategorias);

// Novas rotas otimizadas
router.get('/edital/:editalId/areas-e-subareas', getAreasComSubareas);
router.get('/edital/:editalId/subarea/:subareaId', getCriteriosPorSubarea);

// Rotas para itens de avaliação
router.get('/itens/:subAreaId', getItensAvaliacao);
router.get('/itens/:editalId/:subAreaId/pesos', getPesosItensAvaliacao);
router.post('/itens/peso', salvarPesoItem);

// Rotas para sub-áreas
router.get('/sub-areas', getSubAreas);

router.get('/itens-orientador-master', getItensAvaliacaoOrientadorMaster);
router.get('/itens-bolsista-master', getItensAvaliacaoBolsistaMaster);
router.get('/categorias-relatorio-master', getCategoriasRelatorioMaster);
router.get('/itens-relatorio-master', getItensRelatorioMaster);

export default router; 