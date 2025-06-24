import { useState, useEffect, useCallback } from 'react';
import { CriterioProjeto, SubArea, ItemCurriculo, CategoriaCurriculo } from '../types/avaliacao';

const API_BASE_URL = 'http://localhost:3001/api/avaliacao';

export const useAvaliacao = () => {
    const [criteriosProjeto, setCriteriosProjeto] = useState<CriterioProjeto[]>([]);
    const [subAreas, setSubAreas] = useState<SubArea[]>([]);
    const [itensAvaliacao, setItensAvaliacao] = useState<ItemCurriculo[]>([]);
    const [categoriasAvaliacao, setCategoriasAvaliacao] = useState<CategoriaCurriculo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [disponiveisCriteriosProjeto, setDisponiveisCriteriosProjeto] = useState<CriterioProjeto[]>([]);

    // Buscar critérios de projeto para um edital específico
    const fetchCriteriosProjeto = useCallback(async (editalId: string | number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/criterios-projeto/${editalId}`);
            if (!response.ok) throw new Error('Erro ao buscar critérios de projeto');
            const data = await response.json();
            setCriteriosProjeto(data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar pesos dos critérios para um edital
    const fetchPesosCriteriosProjeto = useCallback(async (editalId: string | number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/criterios-projeto/${editalId}/pesos`);
            if (!response.ok) throw new Error('Erro ao buscar pesos dos critérios');
            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Salvar peso de um critério
    const salvarPesoCriterio = useCallback(async (editalId: string | number, criterioId: number, peso: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/criterios-projeto/peso`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ editalId, criterioId, peso }),
            });
            if (!response.ok) throw new Error('Erro ao salvar peso do critério');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar sub-áreas
    const fetchSubAreas = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/sub-areas`);
            if (!response.ok) throw new Error('Erro ao buscar sub-áreas');
            const data = await response.json();
            setSubAreas(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar categorias de avaliação para um edital
    const fetchCategoriasAvaliacao = useCallback(async (editalId: string | number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/categorias/${editalId}`);
            if (!response.ok) throw new Error('Erro ao buscar categorias de avaliação');
            const data = await response.json();
            setCategoriasAvaliacao(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar itens de avaliação para um edital
    const fetchItensAvaliacao = useCallback(async (editalId: string | number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/itens/${editalId}`);
            if (!response.ok) throw new Error('Erro ao buscar itens de avaliação');
            const data = await response.json();
            setItensAvaliacao(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar itens de avaliação para uma sub-área (mantido para compatibilidade)
    const fetchItensAvaliacaoPorSubArea = useCallback(async (subAreaId: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/itens/sub-area/${subAreaId}`);
            if (!response.ok) throw new Error('Erro ao buscar itens de avaliação');
            const data = await response.json();
            setItensAvaliacao(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar pesos dos itens para um edital e sub-área
    const fetchPesosItensAvaliacao = useCallback(async (editalId: string | number, subAreaId: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/itens/${editalId}/${subAreaId}/pesos`);
            if (!response.ok) throw new Error('Erro ao buscar pesos dos itens');
            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar dados completos das categorias com subáreas e itens
    const fetchCategoriasCompletas = useCallback(async (editalId: string | number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/categorias/${editalId}/completas`);
            if (!response.ok) throw new Error('Erro ao buscar dados completos das categorias');
            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Otimização: Buscar apenas áreas e subáreas para um edital
    const fetchAreasComSubareas = useCallback(async (editalId: string | number) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/edital/${editalId}/areas-e-subareas`);
            if (!response.ok) throw new Error('Erro ao buscar áreas e subáreas');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Otimização: Buscar critérios para uma subárea específica
    const fetchCriteriosPorSubarea = useCallback(async (editalId: string | number, subareaId: number) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/edital/${editalId}/subarea/${subareaId}`);
            if (!response.ok) throw new Error('Erro ao buscar critérios para a subárea');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Salvar peso de um item (versão simplificada para currículo)
    const salvarPesoItem = useCallback(async (editalId: string | number, itemId: string, peso: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/itens/peso`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ editalId, itemId, peso }),
            });
            if (!response.ok) throw new Error('Erro ao salvar peso do item');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Salvar peso e teto de um item (versão completa para compatibilidade)
    const salvarPesoItemCompleto = useCallback(async (editalId: string | number, subAreaId: number, itemId: number, peso: number, teto: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/itens/peso-completo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ editalId, subAreaId, itemId, peso, teto }),
            });
            if (!response.ok) throw new Error('Erro ao salvar peso do item');
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDisponiveisCriteriosProjeto = useCallback(async (editalId: string | number) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/criterios-projeto/disponiveis/${editalId}`);
            if (!response.ok) throw new Error('Erro ao buscar critérios de projeto disponíveis');
            const data = await response.json();
            setDisponiveisCriteriosProjeto(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCriterioProjeto = useCallback(async (criterio: { item: string, descricao: string }): Promise<CriterioProjeto | null> => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/criterios-projeto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(criterio),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar novo critério');
            }
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Remover critério de projeto de um edital
    const removerCriterioProjeto = useCallback(async (editalId: string | number, criterioId: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/criterios-projeto/${editalId}/${criterioId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao remover critério');
            }
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Carregar dados iniciais
    useEffect(() => {
        fetchSubAreas();
    }, [fetchSubAreas]);

    return {
        criteriosProjeto,
        subAreas,
        itensAvaliacao,
        categoriasAvaliacao,
        loading,
        error,
        fetchCriteriosProjeto,
        fetchPesosCriteriosProjeto,
        salvarPesoCriterio,
        fetchSubAreas,
        fetchCategoriasAvaliacao,
        fetchItensAvaliacao,
        fetchItensAvaliacaoPorSubArea,
        fetchPesosItensAvaliacao,
        fetchCategoriasCompletas,
        fetchAreasComSubareas,
        fetchCriteriosPorSubarea,
        salvarPesoItem,
        salvarPesoItemCompleto,
        disponiveisCriteriosProjeto,
        fetchDisponiveisCriteriosProjeto,
        createCriterioProjeto,
        removerCriterioProjeto,
    };
}; 