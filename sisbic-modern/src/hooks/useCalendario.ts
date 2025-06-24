import { useState, useCallback } from 'react';

// A URL base da API é gerenciada pelo proxy no package.json em desenvolvimento
const API_BASE_URL = '/api';

// Tipos para o calendário
export interface Evento {
    id: number;
    descricao: string;
}

export interface Atividade {
    id: number;
    descricao: string;
    codigoRelatorio?: number;
}

export interface EventoCalendario {
    id: number;
    editalId: number;
    eventoId?: number;
    atividadeId?: number;
    dataInicio: string;
    dataFim: string;
    dataFimProrrogacao?: string;
    usuario?: string;
    eventoDescricao?: string;
}

export interface CalendarioAgrupado {
    atividadeId: number;
    atividadeDescricao: string;
    eventos: EventoCalendario[];
}

export interface NovoEventoCalendario {
    editalId: number;
    eventoId?: number;
    atividadeId?: number;
    dataInicio: string;
    dataFim: string;
    dataFimProrrogacao?: string;
    usuario?: string;
}

export const useCalendario = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Buscar todos os eventos disponíveis
    const fetchEventos = useCallback(async (): Promise<Evento[]> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/calendario/eventos`);
            if (!response.ok) throw new Error('Erro ao buscar eventos');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar todas as atividades disponíveis para um edital
    const fetchAtividades = useCallback(async (editalId: string | number): Promise<Atividade[]> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/calendario/atividades/${editalId}`);
            if (!response.ok) throw new Error('Erro ao buscar atividades');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar calendário completo de um edital, já agrupado
    const fetchCalendarioEdital = useCallback(async (editalId: string | number): Promise<CalendarioAgrupado[]> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/calendario/${editalId}`);
            if (!response.ok) throw new Error('Erro ao buscar calendário do edital');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Adicionar novo evento/atividade ao calendário
    const adicionarEventoCalendario = useCallback(async (dados: NovoEventoCalendario): Promise<{ id: number; message: string } | null> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/calendario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });
            if (!response.ok) throw new Error('Erro ao adicionar evento ao calendário');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Atualizar evento/atividade do calendário
    const atualizarEventoCalendario = useCallback(async (id: number, dados: Partial<NovoEventoCalendario>): Promise<{ message: string } | null> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/calendario/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });
            if (!response.ok) throw new Error('Erro ao atualizar evento do calendário');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Excluir evento/atividade do calendário
    const excluirEventoCalendario = useCallback(async (id: number): Promise<{ message: string } | null> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/calendario/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Erro ao excluir evento do calendário');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Limpar erro
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        fetchEventos,
        fetchAtividades,
        fetchCalendarioEdital,
        adicionarEventoCalendario,
        atualizarEventoCalendario,
        excluirEventoCalendario,
        clearError,
    };
}; 