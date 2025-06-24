import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Relatorio } from '../types/relatorio';

const API_URL = 'http://localhost:3001/api';

export const useRelatorios = (editalId: string | undefined) => {
    const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRelatorios = useCallback(async () => {
        if (!editalId) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/relatorios/${editalId}`);
            setRelatorios(response.data);
            setError(null);
        } catch (err) {
            setError('Falha ao buscar relatórios.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [editalId]);

    useEffect(() => {
        fetchRelatorios();
    }, [fetchRelatorios]);

    const criarRelatorio = async (novoRelatorio: { descricao: string; avaliadores: number }) => {
        if (!editalId) {
            setError("ID do edital não encontrado.");
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/relatorios/${editalId}`, novoRelatorio);
            if (response.status === 201) {
                await fetchRelatorios(); // Re-fetch the list
            }
        } catch (err) {
            setError('Falha ao criar relatório.');
            console.error(err);
            throw err; // Re-throw for the form to catch it
        }
    };

    const deleteRelatorio = async (relatorioId: number) => {
        if (!editalId) {
            setError("ID do edital não encontrado.");
            return;
        }
        try {
            const response = await axios.delete(`${API_URL}/relatorios/${editalId}/${relatorioId}`);
            if (response.status === 200) {
                await fetchRelatorios(); // Re-fetch the list
            }
        } catch (err) {
            setError('Falha ao deletar relatório.');
            console.error(err);
            throw err;
        }
    };

    return { relatorios, loading, error, refetch: fetchRelatorios, criarRelatorio, deleteRelatorio };
}; 