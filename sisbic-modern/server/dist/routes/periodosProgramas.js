"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const periodosProgramasController_1 = require("../controllers/periodosProgramasController");
const relatorios_1 = __importDefault(require("./relatorios"));
const router = (0, express_1.Router)();
router.get('/', periodosProgramasController_1.getPeriodosProgramas);
router.get('/:id', periodosProgramasController_1.getPeriodoProgramaById);
router.put('/:id', periodosProgramasController_1.updatePeriodoPrograma);
router.delete('/:id', periodosProgramasController_1.deletePeriodoPrograma);
// Rotas para agências de um edital
router.get('/:id/agencias', periodosProgramasController_1.listarAgenciasPorEdital);
router.post('/:id/agencias', periodosProgramasController_1.adicionarAgenciaEdital);
router.put('/:id/agencias/:agenciaId', periodosProgramasController_1.updateAgenciaEdital);
router.delete('/:id/agencias/:agenciaId', periodosProgramasController_1.deleteAgenciaEdital);
// Rotas para configuração de submissão do edital
router.get('/:id/configuracao-submissao', periodosProgramasController_1.getProjetoConfiguracao);
router.post('/:id/configuracao-submissao', periodosProgramasController_1.upsertProjetoConfiguracao);
// Rotas para relatórios de um edital
router.use('/:id/relatorios', relatorios_1.default);
exports.default = router;
