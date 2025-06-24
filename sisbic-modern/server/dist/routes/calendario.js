"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const calendarioController_1 = require("../controllers/calendarioController");
const router = express_1.default.Router();
// Rotas para eventos
router.get('/eventos', calendarioController_1.getEventos);
// Rotas para atividades
router.get('/atividades/:editalId', calendarioController_1.getAtividades);
// Rotas para calendário do edital
router.get('/:editalId', calendarioController_1.getCalendarioEdital);
router.post('/', calendarioController_1.adicionarEventoCalendario);
router.put('/:id', calendarioController_1.atualizarEventoCalendario);
router.delete('/:id', calendarioController_1.excluirEventoCalendario);
exports.default = router;
