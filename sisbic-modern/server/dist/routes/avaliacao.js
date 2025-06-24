"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const avaliacaoController_1 = require("../controllers/avaliacaoController");
const router = express_1.default.Router();
// Rotas para Avaliação de Projeto
router.get('/criterios-projeto/disponiveis/:editalId', avaliacaoController_1.getDisponiveisCriteriosProjeto);
router.get('/criterios-projeto/:editalId', avaliacaoController_1.getCriteriosProjeto);
router.get('/criterios-projeto/:editalId/pesos', avaliacaoController_1.getPesosCriteriosProjeto);
router.post('/criterios-projeto/:editalId/peso', avaliacaoController_1.salvarPesoCriterio);
router.post('/criterios-projeto', avaliacaoController_1.createCriterioProjeto);
router.delete('/criterios-projeto/:editalId/:criterioId', avaliacaoController_1.removerCriterioProjeto);
// Rotas para categorias de avaliação
router.get('/categorias/:editalId', avaliacaoController_1.getCategoriasAvaliacao);
router.get('/categorias/:editalId/completas', avaliacaoController_1.getCategoriasCompletas);
router.get('/categorias/:editalId/debug', avaliacaoController_1.debugCategorias);
// Novas rotas otimizadas
router.get('/edital/:editalId/areas-e-subareas', avaliacaoController_1.getAreasComSubareas);
router.get('/edital/:editalId/subarea/:subareaId', avaliacaoController_1.getCriteriosPorSubarea);
// Rotas para itens de avaliação
router.get('/itens/:subAreaId', avaliacaoController_1.getItensAvaliacao);
router.get('/itens/:editalId/:subAreaId/pesos', avaliacaoController_1.getPesosItensAvaliacao);
router.post('/itens/peso', avaliacaoController_1.salvarPesoItem);
// Rotas para sub-áreas
router.get('/sub-areas', avaliacaoController_1.getSubAreas);
router.get('/itens-orientador-master', avaliacaoController_1.getItensAvaliacaoOrientadorMaster);
router.get('/itens-bolsista-master', avaliacaoController_1.getItensAvaliacaoBolsistaMaster);
router.get('/categorias-relatorio-master', avaliacaoController_1.getCategoriasRelatorioMaster);
router.get('/itens-relatorio-master', avaliacaoController_1.getItensRelatorioMaster);
exports.default = router;
