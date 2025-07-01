import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import { Editais } from './pages/admin/Editais';
import Programas from './pages/admin/Programas';
import ConfigurarEdital from './pages/admin/ConfigurarEdital';
import EditalConfigLayout, { EditalNovoLayout } from './layouts/EditalConfigLayout';
import EditalDadosGerais from './pages/admin/forms/EditalDadosGerais';
import AgenciasFomento from './pages/admin/forms/AgenciasFomento';
import SubmissaoConfig from './pages/admin/forms/SubmissaoConfig';
import AvaliacaoProjetos from './pages/admin/forms/AvaliacaoProjetos';
import AvaliacaoCurriculo from './pages/admin/forms/AvaliacaoCurriculo';
import Calendario from './pages/admin/forms/Calendario';
import Relatorios from './pages/admin/forms/Relatorios';
import ConfigurarRelatorio from './pages/admin/forms/ConfigurarRelatorio';
import GerenciarConceitosPage from './pages/admin/forms/relatorios/GerenciarConceitosPage';
import GerenciarEstruturaPage from './pages/admin/forms/relatorios/GerenciarEstruturaPage';
import GerenciarItensAvaliacaoPage from './pages/admin/forms/relatorios/GerenciarItensAvaliacaoPage';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="editais" element={<Editais />} />
            <Route path="editais/:id/configurar" element={<EditalConfigLayout />}>
              <Route index element={<ConfigurarEdital />} />
              <Route path="dados-gerais" element={<EditalDadosGerais />} />
              <Route path="agencias-fomento" element={<AgenciasFomento />} />
              <Route path="configurar-submissao" element={<SubmissaoConfig />} />
              <Route path="avaliacao-projetos" element={<AvaliacaoProjetos />} />
              <Route path="avaliacao-curriculo" element={<AvaliacaoCurriculo />} />
              <Route path="calendario" element={<Calendario />} />
              <Route path="relatorios" element={<Relatorios />} />
            </Route>
            <Route path="editais/:editalId/relatorios/:relatorioId/configurar" element={<ConfigurarRelatorio />} />
            <Route path="editais/:editalId/relatorios/:relatorioId/estrutura" element={<GerenciarEstruturaPage />} />
            <Route path="editais/:editalId/relatorios/:relatorioId/conceitos" element={<GerenciarConceitosPage />} />
            <Route path="editais/:editalId/relatorios/:relatorioId/itens-avaliacao" element={<GerenciarItensAvaliacaoPage />} />
            <Route path="editais/novo" element={<EditalNovoLayout />}>
              <Route index element={<ConfigurarEdital isNovo={true} />} />
            </Route>
            <Route path="programas" element={<Programas />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;