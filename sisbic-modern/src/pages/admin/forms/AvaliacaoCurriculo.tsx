import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, Edit, Save, X, CheckCircle, AlertCircle, Filter, Search, FileText, ChevronLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Select, { SelectOption } from '../../../components/ui/Select';
import { useAvaliacao } from '../../../hooks/useAvaliacao';
import DataTable from '../../../components/ui/DataTable';
import { useParams, Link } from 'react-router-dom';

// Tipos para a nova estrutura de dados otimizada
interface Categoria {
    id: number;
    sigla: string;
    descricao: string;
    itens: ItemCurriculo[];
}

interface SubareaView {
    id: number;
    descricao: string;
    area: string;
    categorias: Categoria[];
}

interface AreaComSubareas {
    area: string;
    subareas: { id: number; nome: string }[];
}

interface ItemCurriculo {
    id: number;
    descricao: string;
    peso: number;
    automatico: boolean;
}

const AvaliacaoCurriculo: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<{ itemId: number } | null>(null);
    const [editForm, setEditForm] = useState({ peso: 0 });
    
    // Estados de seleção e visualização
    const [areasComSubareas, setAreasComSubareas] = useState<AreaComSubareas[]>([]);
    const [filtroArea, setFiltroArea] = useState<string>('');
    const [filtroSubareaId, setFiltroSubareaId] = useState<number | null>(null);
    const [subareaSelecionada, setSubareaSelecionada] = useState<SubareaView | null>(null);
    const [modoFormulario, setModoFormulario] = useState<'selecao' | 'formulario'>('selecao');

    const {
        loading: apiLoading,
        error: apiError,
        fetchAreasComSubareas,
        fetchCriteriosPorSubarea,
        salvarPesoItemCompleto,
    } = useAvaliacao();

    // Carregar a estrutura de áreas e subáreas no início
    useEffect(() => {
        if (id) {
            const carregarEstrutura = async () => {
                setLoading(true);
                const data = await fetchAreasComSubareas(id);
                setAreasComSubareas(data);
                setLoading(false);
            };
            carregarEstrutura();
        }
    }, [id, fetchAreasComSubareas]);

    // Opções para os comboboxes, agora baseadas na estrutura leve
    const areasOptions: SelectOption[] = useMemo(() => 
        areasComSubareas.map(a => ({ value: a.area, label: a.area })),
    [areasComSubareas]);

    const subareasOptions: SelectOption[] = useMemo(() => {
        if (!filtroArea) return [];
        const areaData = areasComSubareas.find(a => a.area === filtroArea);
        return areaData ? areaData.subareas.map(s => ({ value: s.id, label: s.nome })) : [];
    }, [filtroArea, areasComSubareas]);

    // Exibir erros da API
    useEffect(() => {
        if (apiError) {
            setError(apiError);
            setTimeout(() => setError(null), 5000);
        }
    }, [apiError]);

    // Função para buscar e exibir o formulário de uma subárea
    const selecionarSubarea = useCallback(async () => {
        if (!id || !filtroSubareaId) {
            setError('Selecione uma área e uma subárea para continuar');
            setTimeout(() => setError(null), 3000);
            return;
        }

        setLoading(true);
        const criterios = await fetchCriteriosPorSubarea(id, filtroSubareaId);
        
        if (criterios.length > 0) {
            const subareaInfo = areasComSubareas
                .flatMap(a => a.subareas.map(s => ({ ...s, area: a.area })))
                .find(s => s.id === filtroSubareaId);

            // Agrupar critérios por categoria
            const categoriasMap = new Map<number, Categoria>();
            for (const criterio of criterios) {
                if (!categoriasMap.has(criterio.categoriaId)) {
                    categoriasMap.set(criterio.categoriaId, {
                        id: criterio.categoriaId,
                        sigla: criterio.categoriaSigla,
                        descricao: criterio.categoriaDescricao,
                        itens: []
                    });
                }
                const categoria = categoriasMap.get(criterio.categoriaId)!;
                categoria.itens.push({
                    id: criterio.itemId,
                    descricao: criterio.itemDescricao,
                    peso: criterio.itemPeso || 0,
                    automatico: criterio.automatico === 'S' // <-- CORREÇÃO DO BUG
                });
            }

            const subareaView: SubareaView = {
                id: filtroSubareaId,
                descricao: subareaInfo?.nome || '',
                area: subareaInfo?.area || '',
                categorias: Array.from(categoriasMap.values()).sort((a,b) => a.sigla.localeCompare(b.sigla)),
            };

            setSubareaSelecionada(subareaView);
            setModoFormulario('formulario');
        } else {
            setError('Nenhum critério encontrado para esta subárea.');
            setTimeout(() => setError(null), 3000);
        }
        setLoading(false);

    }, [id, filtroSubareaId, fetchCriteriosPorSubarea, areasComSubareas]);


    const voltarSelecao = useCallback(() => {
        setModoFormulario('selecao');
        setSubareaSelecionada(null);
    }, []);

    const handleEdit = useCallback((item: ItemCurriculo) => {
        setEditingItem({ itemId: item.id });
        setEditForm({ peso: item.peso });
    }, []);

    const handleSaveEdit = useCallback(async () => {
        if (!editingItem || !id || !subareaSelecionada) return;
        
        try {
            setLoading(true);
            await salvarPesoItemCompleto(id, subareaSelecionada.id, editingItem.itemId, editForm.peso, 0);
            setEditingItem(null);
            setEditForm({ peso: 0 });
            setSuccessMessage('Peso atualizado com sucesso!');
            setTimeout(() => setSuccessMessage(null), 3000);
            
            // Recarrega os dados da subárea para refletir a mudança
            await selecionarSubarea();
            
        } catch (error) {
            setError('Erro ao atualizar peso');
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }, [editingItem, editForm, id, salvarPesoItemCompleto, selecionarSubarea, subareaSelecionada]);

    const handleCancelEdit = useCallback(() => {
        setEditingItem(null);
        setEditForm({ peso: 0 });
    }, []);

    const limparFiltros = useCallback(() => {
        setFiltroArea('');
        setFiltroSubareaId(null);
        setModoFormulario('selecao');
    }, []);
    
    // Funções wrapper para garantir tipos corretos
    const handleAreaChange = useCallback((value: string | number) => {
        setFiltroArea(String(value));
        setFiltroSubareaId(null); // Reseta a subárea ao trocar de área
    }, []);

    const handleSubareaChange = useCallback((value: string | number) => {
        setFiltroSubareaId(Number(value));
    }, []);


    if ((apiLoading && !subareaSelecionada) || (loading && !subareaSelecionada)) { // Mostra loading principal
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-text-secondary">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <AlertCircle className="text-red-500 mr-2" size={20} />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                        <CheckCircle className="text-green-500 mr-2" size={20} />
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Avaliação de Currículo Lattes</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Configure os pesos dos critérios para avaliação do currículo Lattes por subárea.
                        </p>
                    </div>
                    {modoFormulario === 'formulario' && (
                        <Button
                            onClick={voltarSelecao}
                            variant="secondary"
                            className="flex items-center"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Voltar à Seleção
                        </Button>
                    )}
                </div>

                {modoFormulario === 'selecao' ? (
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Search size={16} className="mr-2" />
                            Selecionar Subárea para Configurar
                        </h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Área
                                    </label>
                                    <Select
                                        options={areasOptions}
                                        value={filtroArea}
                                        onChange={handleAreaChange}
                                        placeholder="Selecione uma área"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Subárea *
                                    </label>
                                    <Select
                                        options={subareasOptions}
                                        value={filtroSubareaId ?? ''}
                                        onChange={handleSubareaChange}
                                        placeholder="Selecione uma subárea"
                                        disabled={!filtroArea}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <Button
                                    onClick={selecionarSubarea}
                                    disabled={!filtroArea || !filtroSubareaId}
                                    className="flex items-center"
                                >
                                    <FileText size={16} className="mr-2" />
                                    Configurar Critérios
                                </Button>
                                <Button
                                    onClick={limparFiltros}
                                    variant="ghost"
                                    className="flex items-center"
                                >
                                    <Filter size={16} className="mr-2" />
                                    Limpar Seleção
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Formulário da Subárea Selecionada */}
                        {subareaSelecionada && (
                            <div className="space-y-6">
                                {/* Header da Subárea */}
                                <div className="p-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                                {subareaSelecionada.descricao}
                                            </h2>
                                            <p className="text-blue-700 dark:text-blue-300 mt-1">
                                                {subareaSelecionada.area}
                                            </p>
                                            <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                                                {subareaSelecionada.categorias.reduce((total, cat) => total + cat.itens.length, 0)} critério(s) em {subareaSelecionada.categorias.length} categoria(s)
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {subareaSelecionada.categorias.reduce((totalCat, cat) => totalCat + cat.itens.reduce((totalItem, item) => totalItem + item.peso, 0), 0).toFixed(2)}
                                            </div>
                                            <div className="text-xs text-blue-500 dark:text-blue-300">Peso Total</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabela de Critérios por Categoria */}
                                {subareaSelecionada.categorias.map(categoria => (
                                    <div key={categoria.id} className="">
                                        <div className="px-0 py-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                Categoria {categoria.sigla} - {categoria.descricao}
                                            </h3>
                                        </div>
                                        <DataTable
                                            columns={[
                                                { key: 'criterio', label: 'Critério' },
                                                { key: 'peso', label: 'Peso', className: 'text-center' },
                                                { key: 'tipo', label: 'Tipo', className: 'text-center' },
                                            ]}
                                            data={categoria.itens.map((item) => ({
                                                criterio: <span className="text-gray-900 dark:text-white">{item.descricao}</span>,
                                                peso: editingItem?.itemId === item.id ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.1"
                                                        value={editForm.peso}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                                    />
                                                ) : (
                                                    <span className="text-gray-900 dark:text-white font-medium">{item.peso}</span>
                                                ),
                                                tipo: <span className={`px-2 py-1 text-xs rounded-full ${
                                                    item.automatico
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                }`}>
                                                    {item.automatico ? 'Automático' : 'Manual'}
                                                </span>,
                                                _raw: item
                                            }))}
                                            actions={(row) => {
                                                const item = row._raw;
                                                return editingItem?.itemId === item.id ? (
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                            disabled={loading}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                        <button
                                                            onClick={handleSaveEdit}
                                                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                                            disabled={loading || apiLoading}
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                        disabled={loading || apiLoading}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                );
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
                <div className="mt-8 flex justify-start pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Link to={`/editais/${id}/configurar`}>
                        <Button variant="secondary" type="button">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Voltar para o Hub
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AvaliacaoCurriculo; 