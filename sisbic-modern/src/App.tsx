import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Editais from './pages/admin/Editais';
import Programas from './pages/admin/Programas';
import ConfigurarEdital from './pages/admin/ConfigurarEdital';
import EditalConfigLayout from './layouts/EditalConfigLayout';
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
            </Route>
            <Route path="programas" element={<Programas />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;