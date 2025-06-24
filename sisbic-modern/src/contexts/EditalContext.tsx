import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PeriodoPrograma } from '../types/programa';
import { EditalAgencia } from '../types/agencia';
import { ProjetoConfiguracao } from '../types/projetoConfiguracao';
import { usePeriodosProgramas } from '../hooks/usePeriodosProgramas';
import { useAgencias } from '../hooks/useAgencias';
import { api } from '../api/config';

interface EditalContextType {
  periodo: PeriodoPrograma | null;
  agenciasDoEdital: EditalAgencia[];
  submissaoConfig: ProjetoConfiguracao | null;
  loading: boolean;
  error: string | null;
  fetchEditalData: (id: string | number) => void;
}

const EditalContext = createContext<EditalContextType | undefined>(undefined);

export const EditalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { periodo, buscarPeriodoPorId, loading: periodoLoading, error: periodoError } = usePeriodosProgramas();
  const { agenciasDoEdital, buscarAgenciasPorEdital, loading: agenciasLoading, error: agenciasError } = useAgencias();
  const [submissaoConfig, setSubmissaoConfig] = useState<ProjetoConfiguracao | null>(null);
  const [submissaoLoading, setSubmissaoLoading] = useState(false);
  const [submissaoError, setSubmissaoError] = useState<string | null>(null);

  const fetchEditalData = useCallback(async (id: string | number) => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return;

    buscarPeriodoPorId(numericId);
    buscarAgenciasPorEdital(numericId);

    try {
      setSubmissaoLoading(true);
      const { data } = await api.get<ProjetoConfiguracao>(`/periodos-programas/${numericId}/configuracao-submissao`);
      setSubmissaoConfig(data);
      setSubmissaoError(null);
    } catch (err) {
      setSubmissaoError('Falha ao buscar configuração de submissão.');
      console.error(err);
    } finally {
      setSubmissaoLoading(false);
    }
  }, [buscarPeriodoPorId, buscarAgenciasPorEdital]);

  const loading = periodoLoading || agenciasLoading || submissaoLoading;
  const error = periodoError || agenciasError || submissaoError;

  return (
    <EditalContext.Provider value={{ periodo, agenciasDoEdital, submissaoConfig, loading, error, fetchEditalData }}>
      {children}
    </EditalContext.Provider>
  );
};

export const useEdital = () => {
  const context = useContext(EditalContext);
  if (context === undefined) {
    throw new Error('useEdital must be used within an EditalProvider');
  }
  return context;
}; 