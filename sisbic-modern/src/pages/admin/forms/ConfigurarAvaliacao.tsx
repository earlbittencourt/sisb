import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Trash2, Edit } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { CategoriaCurriculo, CriterioProjeto, ItemCurriculo, SubArea } from '../../../types/avaliacao';
import Select from '../../../components/ui/Select';
import { useAvaliacao } from '../../../hooks/useAvaliacao';

const ConfigurarAvaliacao: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'projeto' | 'curriculo'>('projeto');
    const [selectedSubArea, setSelectedSubArea] = useState<number | null>(null);
    const [pesosCriterios, setPesosCriterios] = useState<any[]>([]);
    const [pesosItens, setPesosItens] = useState<any[]>([]);

    const {
        criteriosProjeto,
        subAreas,
        itensAvaliacao,
        loading,
        error,
        fetchPesosCriteriosProjeto,
        salvarPesoCriterio,
        fetchItensAvaliacao,
        fetchPesosItensAvaliacao,
        salvarPesoItem,
        salvarPesoItemCompleto,
    } = useAvaliacao();

    // Carregar pesos dos critérios quando o componente montar
    useEffect(() => {
        if (id) {
            fetchPesosCriteriosProjeto(id).then(setPesosCriterios);
        }
    }, [id, fetchPesosCriteriosProjeto]);

    // Carregar itens de avaliação quando uma sub-área for selecionada
    useEffect(() => {
        if (selectedSubArea) {
            fetchItensAvaliacao(selectedSubArea);
            if (id) {
                fetchPesosItensAvaliacao(id, selectedSubArea).then(setPesosItens);
            }
        }
    }, [selectedSubArea, id, fetchItensAvaliacao, fetchPesosItensAvaliacao]);

    // Função para obter o peso de um critério
    const getPesoCriterio = useCallback((criterioId: number) => {
        const peso = pesosCriterios.find(p => p.criterioId === criterioId);
        return peso ? peso.peso : 0;
    }, [pesosCriterios]);

    // Função para salvar peso de um critério
    const handleSalvarPesoCriterio = useCallback(async (criterioId: number, peso: number) => {
        if (!id) return;
        try {
            await salvarPesoCriterio(id, criterioId, peso);
            // Recarregar pesos
            const novosPesos = await fetchPesosCriteriosProjeto(id);
            setPesosCriterios(novosPesos);
        } catch (error) {
            console.error('Erro ao salvar peso:', error);
        }
    }, [id, salvarPesoCriterio, fetchPesosCriteriosProjeto]);

    // Função para obter peso e teto de um item
    const getPesoItem = useCallback((itemId: number) => {
        const peso = pesosItens.find(p => p.itemId === itemId);
        return {
            peso: peso ? peso.peso : 0,
            teto: peso ? peso.teto : 0
        };
    }, [pesosItens]);

    // Função para salvar peso e teto de um item
    const handleSalvarPesoItem = useCallback(async (itemId: number, peso: number, teto: number) => {
        if (!id || !selectedSubArea) return;
        try {
            await salvarPesoItemCompleto(id, selectedSubArea, itemId, peso, teto);
            // Recarregar pesos
            const novosPesos = await fetchPesosItensAvaliacao(id, selectedSubArea);
            setPesosItens(novosPesos);
        } catch (error) {
            console.error('Erro ao salvar peso do item:', error);
        }
    }, [id, selectedSubArea, salvarPesoItemCompleto, fetchPesosItensAvaliacao]);

    // Memoizar as opções do Select para evitar re-renderizações
    const subAreaOptions = useMemo(() => 
        subAreas.map(sa => ({ value: sa.id, label: sa.descricao })), 
        [subAreas]
    );

    const renderAvaliacaoProjeto = () => (
        <Card>
            <h3 className="text-xl font-bold text-text-primary mb-4">Critérios de Avaliação do Projeto</h3>
            <p className="text-text-secondary mb-6">Configure os pesos para cada critério de avaliação do projeto.</p>
            
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Item</th>
                            <th scope="col" className="px-6 py-3">Descrição</th>
                            <th scope="col" className="px-6 py-3">Peso</th>
                            <th scope="col" className="px-6 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {criteriosProjeto.map((criterio) => (
                            <tr key={criterio.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-mono text-xs">{criterio.item}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{criterio.descricao}</td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={getPesoCriterio(criterio.id)}
                                        onChange={(e) => handleSalvarPesoCriterio(criterio.id, parseFloat(e.target.value) || 0)}
                                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3">
                                        <Edit size={16}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    const renderAvaliacaoCurriculo = () => (
        <div className="space-y-8">
            <Card>
                <h3 className="text-xl font-bold text-text-primary mb-2">Seleção da Sub-Área</h3>
                <p className="text-text-secondary mb-4">Os pesos e tetos da avaliação de currículo são definidos por sub-área de conhecimento.</p>
                <Select
                    placeholder="Selecione uma Sub-Área"
                    value={selectedSubArea ?? ''}
                    onChange={(value) => setSelectedSubArea(Number(value))}
                    options={subAreaOptions}
                    className="max-w-md"
                />
            </Card>

            {/* Gerenciamento de Categorias e Itens aparece apenas se uma sub-área for selecionada */}
            {selectedSubArea && (
                <>
                    <Card>
                        <h3 className="text-xl font-bold text-text-primary mb-4">Categorias de Produção</h3>
                        <p className="text-text-secondary mb-6">Gerencie as categorias principais para a avaliação de currículo (ex: Produção Científica, Tecnológica).</p>
                        {/* Tabela de Categorias + Formulário */}
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold text-text-primary mb-4">Itens de Avaliação do Currículo</h3>
                        <p className="text-text-secondary mb-6">Adicione ou edite os itens específicos, seus pesos e tetos de pontuação para a sub-área selecionada.</p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Item</th>
                                        <th scope="col" className="px-6 py-3">Descrição</th>
                                        <th scope="col" className="px-6 py-3">Peso</th>
                                        <th scope="col" className="px-6 py-3">Teto</th>
                                        <th scope="col" className="px-6 py-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensAvaliacao.map((item) => {
                                        const { peso, teto } = getPesoItem(Number(item.id));
                                        return (
                                            <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4 font-mono text-xs">{item.id}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.descricao}</td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.1"
                                                        value={peso}
                                                        onChange={(e) => handleSalvarPesoItem(Number(item.id), parseFloat(e.target.value) || 0, teto)}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.1"
                                                        value={teto}
                                                        onChange={(e) => handleSalvarPesoItem(Number(item.id), peso, parseFloat(e.target.value) || 0)}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3">
                                                        <Edit size={16}/>
                                                    </button>
                                                    <button className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-text-secondary">Carregando dados de avaliação...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Erro: {error}</p>
                    <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-text-primary">Configurar Avaliação</h1>
                    </div>
                    <Link to={`/editais/${id}/configurar`}>
                        <Button variant="secondary" className="flex items-center">
                            <ArrowLeft size={16} className="mr-2" />
                            Voltar
                        </Button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('projeto')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'projeto'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                Avaliação de Projetos
                            </button>
                            <button
                                onClick={() => setActiveTab('curriculo')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'curriculo'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                Avaliação de Currículo (Lattes)
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'projeto' ? renderAvaliacaoProjeto() : renderAvaliacaoCurriculo()}

                <div className="mt-12">
                    <Link to={`/editais/${id}/configurar`}>
                        <Button variant="secondary" className="flex items-center">
                            <ArrowLeft size={16} className="mr-2" />
                            Voltar para o Hub
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ConfigurarAvaliacao; 