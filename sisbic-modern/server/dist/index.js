"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
const periodosProgramas_1 = __importDefault(require("./routes/periodosProgramas"));
const programas_1 = __importDefault(require("./routes/programas"));
const status_1 = __importDefault(require("./routes/status"));
const agencias_1 = __importDefault(require("./routes/agencias"));
const avaliacao_1 = __importDefault(require("./routes/avaliacao"));
const calendario_1 = __importDefault(require("./routes/calendario"));
const relatorios_1 = __importDefault(require("./routes/relatorios"));
const conceitos_1 = __importDefault(require("./routes/conceitos"));
const itensOrientador_1 = __importDefault(require("./routes/itensOrientador"));
const itensBolsista_1 = __importDefault(require("./routes/itensBolsista"));
const estruturaRelatorio_1 = __importDefault(require("./routes/estruturaRelatorio"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000'
}));
app.use(express_1.default.json());
// Rotas
app.use('/api/periodos-programas', periodosProgramas_1.default);
app.use('/api/programas', programas_1.default);
app.use('/api/status', status_1.default);
app.use('/api/agencias', agencias_1.default);
app.use('/api/avaliacao', avaliacao_1.default);
app.use('/api/calendario', calendario_1.default);
app.use('/api/relatorios', relatorios_1.default);
app.use('/api/conceitos', conceitos_1.default);
app.use('/api/itens-orientador', itensOrientador_1.default);
app.use('/api/itens-bolsista', itensBolsista_1.default);
app.use('/api/estrutura-relatorio', estruturaRelatorio_1.default);
// Teste de conexão com o banco
(0, database_1.connectToDatabase)()
    .then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
})
    .catch((error) => {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
});
