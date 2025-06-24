"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const relatoriosController_1 = require("../controllers/relatoriosController");
const router = express_1.default.Router();
// GET /api/itens-bolsista/:relatorioId
router.get('/:relatorioId', relatoriosController_1.getItensBolsista);
// POST /api/itens-bolsista/:relatorioId
router.post('/:relatorioId', relatoriosController_1.salvarItensBolsista);
exports.default = router;
