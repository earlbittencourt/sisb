import { useState, useCallback } from 'react';
import { api } from '../api/config';
import { Agencia, EditalAgencia } from '../types/agencia';

export const useAgencias = () => {
    const [agencias, setAgencias] = useState<Agencia[]>([]);
    const [agenciasDoEdital, setAgenciasDoEdital] = useState<EditalAgencia[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscarAgencias = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/agencias');
            setAgencias(response.data);
        } catch (err) {
            setError('Falha ao buscar agências de fomento.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarAgenciasPorEdital = useCallback(async (editalId: number) => {
        setLoading(true);
        try {
            const response = await api.get(`/periodos-programas/${editalId}/agencias`);
            setAgenciasDoEdital(response.data);
        } catch (err) {
            setError('Falha ao buscar agências do edital.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const adicionarAgencia = useCallback(async (editalId: number, agenciaId: number, cotas: number) => {
        setLoading(true);
        try {
            await api.post(`/periodos-programas/${editalId}/agencias`, { agenciaId, cotas });
            // Recarrega a lista para mostrar a nova agência
            await buscarAgenciasPorEdital(editalId);
        } catch (err) {
            setError('Falha ao adicionar agência ao edital.');
            console.error(err);
            throw err; // Lança o erro para o componente do modal poder tratá-lo
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        agencias, 
        agenciasDoEdital, 
        loading, 
        error, 
        buscarAgencias, 
        buscarAgenciasPorEdital, 
        adicionarAgencia 
    };
}; 