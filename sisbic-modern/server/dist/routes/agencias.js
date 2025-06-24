"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agenciasController_1 = require("../controllers/agenciasController");
const router = (0, express_1.Router)();
// Rota para buscar todas as agências de fomento
router.get('/', agenciasController_1.listarAgencias);
exports.default = router;
