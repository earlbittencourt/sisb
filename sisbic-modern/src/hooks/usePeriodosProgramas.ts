import { useState, useCallback, useEffect } from 'react';
import { api } from '../api/config';
import { PeriodoPrograma } from '../types/programa';

export function usePeriodosProgramas() {
    const [periodos, setPeriodos] = useState<PeriodoPrograma[]>([]);
    const [periodo, setPeriodo] = useState<PeriodoPrograma | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscarPeriodos = useCallback(async (params?: { tipos?: string[], status?: string[] }) => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔄 Buscando editais...');
            const queryParams = new URLSearchParams();
            if (params?.tipos && params.tipos.length > 0) {
                params.tipos.forEach(tipo => queryParams.append('tipos', tipo));
            }
            if (params?.status && params.status.length > 0) {
                params.status.forEach(status => queryParams.append('status', status));
            }
            
            const response = await api.get('/periodos-programas', { 
                params: queryParams
            });
            console.log('✅ Editais carregados:', response.data);
            setPeriodos(response.data);
        } catch (err) {
            console.error('❌ Erro ao buscar editais:', err);
            setError('Falha ao buscar períodos dos programas.');
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
                await api.post('/periodos-programas', data);
            }
            await buscarPeriodos(); // Recarrega a lista após salvar
        } catch (err) {
            setError('Falha ao salvar o período do programa.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [buscarPeriodos]);

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

    // Carregar editais automaticamente quando o hook é inicializado
    useEffect(() => {
        console.log('🚀 Hook usePeriodosProgramas inicializado');
        buscarPeriodos();
    }, [buscarPeriodos]);

    return { periodos, periodo, loading, error, buscarPeriodos, buscarPeriodoPorId, salvarPeriodo, deletarPeriodo };
} 