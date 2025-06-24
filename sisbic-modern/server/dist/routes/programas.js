"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const programasController_1 = require("../controllers/programasController");
const router = (0, express_1.Router)();
router.get('/', programasController_1.listarProgramas);
exports.default = router;
