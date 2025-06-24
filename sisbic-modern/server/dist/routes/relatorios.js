"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const relatoriosController_1 = require("../controllers/relatoriosController");
const router = express_1.default.Router();
// Rota para listar relatórios de um edital específico
// GET /api/relatorios/:editalId
router.get('/:editalId', relatoriosController_1.listarRelatorios);
// Rota para criar um novo relatório para um edital
// POST /api/relatorios/:editalId
router.post('/:editalId', relatoriosController_1.criarRelatorio);
// Rota para buscar um relatório específico pelo ID
// GET /api/relatorios/:editalId/:relatorioId
router.get('/:editalId/:relatorioId', relatoriosController_1.getRelatorioById);
// Rota para deletar um relatório específico
// DELETE /api/relatorios/:editalId/:relatorioId
router.delete('/:editalId/:relatorioId', relatoriosController_1.deleteRelatorio);
exports.default = router;
