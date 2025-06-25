import { useState, useCallback } from 'react';
import { getPeriodosProgramas, deletePeriodoPrograma, getPeriodoProgramaById, updatePeriodoPrograma } from '../api/periodosProgramas';
import { api } from '../api/config';
import { PeriodoPrograma } from '../types/programa';

export function usePeriodosProgramas() {
    const [periodos, setPeriodos] = useState<PeriodoPrograma[]>([]);
    const [periodo, setPeriodo] = useState<PeriodoPrograma | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscarPeriodos = useCallback(async (params?: { tipo?: string, status?: string }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/periodos-programas', { params });
            setPeriodos(response.data);
        } catch (err) {
            setError('Falha ao buscar períodos dos programas.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarPeriodoPorId = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/periodos-programas/${id}`);
            setPeriodo(response.data);
        } catch (err) {
            setError('Falha ao buscar o período do programa.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const salvarPeriodo = useCallback(async (data: Partial<PeriodoPrograma>) => {
        setLoading(true);
        setError(null);
        try {
            if (data.PEP_Codigo) {
                await api.put(`/periodos-programas/${data.PEP_Codigo}`, data);
            } else {
                // Lógica para criar novo
            }
            // Opcional: recarregar dados
        } catch (err) {
            setError('Falha ao salvar o período do programa.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deletarPeriodo = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/periodos-programas/${id}`);
            setPeriodos(prev => prev.filter(p => p.PEP_Codigo !== id));
        } catch (err) {
            setError('Falha ao deletar o período do programa.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { periodos, periodo, loading, error, buscarPeriodos, buscarPeriodoPorId, salvarPeriodo, deletarPeriodo };
} 