import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { api } from '../api/config';
import { 
    Relatorio, 
    ConceitoRelatorio, 
    ItemAvaliacao, 
    ItemAvaliacaoRelatorio,
    EstruturaRelatorioCategoria
} from '../types/relatorio';

const API_URL = 'http://localhost:3001/api';

const confirmarOperacao = (mensagem: string): boolean => {
    return window.confirm(mensagem);
};

export const useRelatorioConfig = (editalId?: string, relatorioId?: string) => {
    const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
    const [conceitos, setConceitos] = useState<ConceitoRelatorio[]>([]);
    const [itensOrientadorMaster, setItensOrientadorMaster] = useState<ItemAvaliacao[]>([]);
    const [itensOrientadorRelatorio, setItensOrientadorRelatorio] = useState<ItemAvaliacaoRelatorio[]>([]);
    const [itensBolsistaMaster, setItensBolsistaMaster] = useState<ItemAvaliacao[]>([]);
    const [itensBolsistaRelatorio, setItensBolsistaRelatorio] = useState<ItemAvaliacaoRelatorio[]>([]);
    const [categoriasMaster, setCategoriasMaster] = useState<ItemAvaliacao[]>([]);
    const [itensEstruturaMaster, setItensEstruturaMaster] = useState<ItemAvaliacao[]>([]);
    const [criteriosMaster, setCriteriosMaster] = useState<ItemAvaliacao[]>([]);
    const [estruturaRelatorio, setEstruturaRelatorio] = useState<EstruturaRelatorioCategoria[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = useCallback(async () => {
        if (!editalId || !relatorioId) {
            setLoading(false);
            setError('IDs do edital e relatório são obrigatórios');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const relatorioPromise = axios.get(`${API_URL}/relatorios/${editalId}/${relatorioId}`);
            const conceitosPromise = axios.get(`${API_URL}/conceitos/${relatorioId}`);
            const itensOrientadorMasterPromise = axios.get(`${API_URL}/avaliacao/itens-orientador-master`);
            const itensOrientadorRelatorioPromise = axios.get(`${API_URL}/itens-orientador/${relatorioId}`);
            const itensBolsistaMasterPromise = axios.get(`${API_URL}/avaliacao/itens-bolsista-master`);
            const itensBolsistaRelatorioPromise = axios.get(`${API_URL}/itens-bolsista/${relatorioId}`);
            const categoriasMasterPromise = axios.get(`${API_URL}/avaliacao/categorias-relatorio-master`);
            const itensEstruturaMasterPromise = axios.get(`${API_URL}/avaliacao/itens-relatorio-master`);
            const estruturaPromise = axios.get(`${API_URL}/estrutura-relatorio/${relatorioId}`);
            const criteriosMasterPromise = axios.get(`${API_URL}/criterios-master`);
            
            const [
                relatorioResponse, 
                conceitosResponse,
                itensOrientadorMasterResponse,
                itensOrientadorRelatorioResponse,
                itensBolsistaMasterResponse,
                itensBolsistaRelatorioResponse,
                categoriasMasterResponse,
                itensEstruturaMasterResponse,
                estruturaResponse,
                criteriosMasterResponse
            ] = await Promise.all([
                relatorioPromise,
                conceitosPromise,
                itensOrientadorMasterPromise,
                itensOrientadorRelatorioPromise,
                itensBolsistaMasterPromise,
                itensBolsistaRelatorioPromise,
                categoriasMasterPromise,
                itensEstruturaMasterPromise,
                estruturaPromise,
                criteriosMasterPromise
            ]);

            setRelatorio(relatorioResponse.data);
            setConceitos(conceitosResponse.data);
            setItensOrientadorMaster(itensOrientadorMasterResponse.data);
            setItensOrientadorRelatorio(itensOrientadorRelatorioResponse.data);
            setItensBolsistaMaster(itensBolsistaMasterResponse.data);
            setItensBolsistaRelatorio(itensBolsistaRelatorioResponse.data);
            setCategoriasMaster(categoriasMasterResponse.data);
            setItensEstruturaMaster(itensEstruturaMasterResponse.data);
            setEstruturaRelatorio(estruturaResponse.data);
            setCriteriosMaster(criteriosMasterResponse.data);
            
            setError(null);
        } catch (err: any) {
            console.error('Erro ao buscar dados de configuração do relatório:', err);
            if (err.response?.status === 404) {
                setError('Relatório não encontrado. Verifique se o ID está correto.');
            } else if (err.response?.status === 500) {
                setError('Erro interno do servidor. Tente novamente mais tarde.');
            } else if (err.code === 'ECONNREFUSED') {
                setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
            } else {
                setError('Falha ao buscar dados de configuração do relatório.');
            }
        } finally {
            setLoading(false);
        }
    }, [editalId, relatorioId]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const addConceito = async (novoConceito: { descricao: string; nivel: number }) => {
        if (!relatorioId) throw new Error("ID do relatório não encontrado.");
        if (!confirmarOperacao('Deseja adicionar este novo conceito?')) {
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/conceitos/${relatorioId}`, novoConceito);
            const conceitoAdicionado = response.data;
            setConceitos(prev => [...prev, conceitoAdicionado].sort((a, b) => a.nivel - b.nivel || a.descricao.localeCompare(b.descricao)));
        } catch (err) {
            setError('Falha ao adicionar conceito.');
            console.error(err);
            throw err;
        }
    };
    
    const updateConceito = async (conceitoId: number, dados: { descricao: string; nivel: number }) => {
        if (!relatorioId) throw new Error("ID do relatório não encontrado.");
        if (!confirmarOperacao('Deseja atualizar este conceito?')) {
            return;
        }
        try {
            await axios.put(`${API_URL}/conceitos/${relatorioId}/${conceitoId}`, dados);
            setConceitos(prevConceitos =>
                prevConceitos.map(c =>
                    c.id === conceitoId ? { ...c, ...dados } : c
                ).sort((a, b) => a.nivel - b.nivel || a.descricao.localeCompare(b.descricao))
            );
        } catch (err) {
            setError('Falha ao atualizar conceito.');
            console.error(err);
            throw err;
        }
    };

    const deleteConceito = async (conceitoId: number) => {
        if (!relatorioId) throw new Error("ID do relatório não encontrado.");
        if (!confirmarOperacao('Tem certeza que deseja excluir este conceito?')) {
            return;
        }
        try {
            await axios.delete(`${API_URL}/conceitos/${relatorioId}/${conceitoId}`);
            setConceitos(prev => prev.filter(c => c.id !== conceitoId));
        } catch (err) {
            setError('Falha ao deletar conceito.');
            console.error(err);
            throw err;
        }
    };

    // --- ITENS ORIENTADOR ---
    const addItemOrientador = async (itemId: number, variacaoNota: string) => {
        if (!relatorioId) throw new Error('ID do relatório não encontrado.');
        if (!confirmarOperacao('Deseja adicionar este item de avaliação do orientador?')) {
            return;
        }
        await axios.post(`${API_URL}/itens-orientador/${relatorioId}/adicionar`, { itemId, variacaoNota });
        await fetchAllData();
    };

    const updateItemOrientador = async (itemId: number, variacaoNota: string) => {
        if (!relatorioId) throw new Error('ID do relatório não encontrado.');
        if (!confirmarOperacao('Deseja atualizar este item de avaliação do orientador?')) {
            return;
        }
        await axios.put(`${API_URL}/itens-orientador/${relatorioId}/${itemId}`, { variacaoNota });
        await fetchAllData();
    };

    const removeItemOrientador = async (itemId: number) => {
        if (!relatorioId) throw new Error('ID do relatório não encontrado.');
        if (!confirmarOperacao('Tem certeza que deseja remover este item de avaliação do orientador?')) {
            return;
        }
        await axios.delete(`${API_URL}/itens-orientador/${relatorioId}/${itemId}`);
        await fetchAllData();
    };

    // --- ITENS BOLSISTA ---
    const addItemBolsista = async (itemId: number, variacaoNota: string) => {
        if (!relatorioId) throw new Error('ID do relatório não encontrado.');
        if (!confirmarOperacao('Deseja adicionar este item de avaliação do bolsista?')) {
            return;
        }
        await axios.post(`${API_URL}/itens-bolsista/${relatorioId}/adicionar`, { itemId, variacaoNota });
        await fetchAllData();
    };

    const updateItemBolsista = async (itemId: number, variacaoNota: string) => {
        if (!relatorioId) throw new Error('ID do relatório não encontrado.');
        if (!confirmarOperacao('Deseja atualizar este item de avaliação do bolsista?')) {
            return;
        }
        try {
            const url = `${API_URL}/itens-bolsista/${relatorioId}/${itemId}`;
            await axios.put(url, { variacaoNota });
            await fetchAllData();
        } catch (err) {
            console.error('Erro ao atualizar item do bolsista:', err);
            throw err;
        }
    };

    const removeItemBolsista = async (itemId: number) => {
        if (!relatorioId) throw new Error('ID do relatório não encontrado.');
        if (!confirmarOperacao('Tem certeza que deseja remover este item de avaliação do bolsista?')) {
            return;
        }
        await axios.delete(`${API_URL}/itens-bolsista/${relatorioId}/${itemId}`);
        await fetchAllData();
    };

    const salvarEstruturaRelatorio = async (estrutura: EstruturaRelatorioCategoria[]) => {
        if (!relatorioId) {
            setError("ID do relatório não encontrado.");
            return;
        }
        try {
            await axios.post(`${API_URL}/estrutura-relatorio/${relatorioId}`, estrutura);
            await fetchAllData();
        } catch (err) {
            setError('Falha ao salvar estrutura do relatório.');
            console.error(err);
            throw err;
        }
    };

    return { 
        relatorio, 
        conceitos, 
        itensOrientadorMaster,
        itensOrientadorRelatorio,
        itensBolsistaMaster,
        itensBolsistaRelatorio,
        categoriasMaster,
        itensEstruturaMaster,
        criteriosMaster,
        estruturaRelatorio,
        loading, 
        error, 
        refetch: fetchAllData, 
        addConceito,
        updateConceito, 
        deleteConceito,
        addItemOrientador,
        updateItemOrientador,
        removeItemOrientador,
        addItemBolsista,
        updateItemBolsista,
        removeItemBolsista,
        salvarEstruturaRelatorio
    };
}; 