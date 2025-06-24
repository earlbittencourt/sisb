import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useAvaliacao } from '../../../hooks/useAvaliacao';

interface CriterioProjeto {
    id: number;
    item: string;
    descricao: string;
    peso: number;
}

// Componente Modal
const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AvaliacaoProjetos: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [criterios, setCriterios] = useState<CriterioProjeto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ item: '', descricao: '', peso: 0 });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCriterio, setNewCriterio] = useState({ item: '', descricao: '', peso: 0 });
    const [selectedCriterio, setSelectedCriterio] = useState<{ value: number; label: string; data: any } | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    const {
        criteriosProjeto,
        loading: apiLoading,
        error: apiError,
        fetchCriteriosProjeto,
        salvarPesoCriterio,
        disponiveisCriteriosProjeto,
        fetchDisponiveisCriteriosProjeto,
        createCriterioProjeto,
        removerCriterioProjeto,
    } = useAvaliacao();

    // Carregar critérios quando o componente montar
    useEffect(() => {
        if (id) {
            fetchCriteriosProjeto(id);
        }
    }, [id, fetchCriteriosProjeto]);

    // Sincronizar dados da API com estado local
    useEffect(() => {
        if (criteriosProjeto.length > 0) {
            setCriterios(criteriosProjeto);
        }
    }, [criteriosProjeto]);

    // Exibir erros da API
    useEffect(() => {
        if (apiError) {
            setError(apiError);
            setTimeout(() => setError(null), 5000);
        }
    }, [apiError]);

    // Função para salvar peso de um critério
    const handleSalvarPesoCriterio = useCallback(async (criterioId: number, peso: number) => {
        if (!id) return;
        try {
            setLoading(true);
            await salvarPesoCriterio(id, criterioId, peso);
            setSuccessMessage('Peso atualizado com sucesso!');
            setTimeout(() => setSuccessMessage(null), 3000);
            // Recarregar critérios para atualizar os pesos
            await fetchCriteriosProjeto(id);
        } catch (error) {
            setError('Erro ao salvar peso do critério');
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }, [id, salvarPesoCriterio, fetchCriteriosProjeto]);

    // Função para iniciar edição
    const handleEdit = useCallback((criterio: CriterioProjeto) => {
        setEditingId(criterio.id);
        setEditForm({
            item: criterio.item,
            descricao: criterio.descricao,
            peso: criterio.peso
        });
    }, []);

    // Função para salvar edição
    const handleSaveEdit = useCallback(async () => {
        if (!editingId) return;
        try {
            setLoading(true);
            await handleSalvarPesoCriterio(editingId, editForm.peso);
            setEditingId(null);
            setEditForm({ item: '', descricao: '', peso: 0 });
            setSuccessMessage('Critério atualizado com sucesso!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            setError('Erro ao atualizar critério');
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }, [editingId, editForm, handleSalvarPesoCriterio]);

    // Função para cancelar edição
    const handleCancelEdit = useCallback(() => {
        setEditingId(null);
        setEditForm({ item: '', descricao: '', peso: 0 });
    }, []);

    // Função para abrir modal de adição
    const handleOpenAddModal = useCallback(() => {
        if (id) {
            fetchDisponiveisCriteriosProjeto(id);
        }
        setShowAddModal(true);
    }, [id, fetchDisponiveisCriteriosProjeto]);

    // Função para fechar modal e resetar estado
    const handleCloseAddModal = useCallback(() => {
        setShowAddModal(false);
        setNewCriterio({ item: '', descricao: '', peso: 0 });
        setSelectedCriterio(null);
        setIsCreatingNew(false);
    }, []);
    
    const handleAddExistente = useCallback(async () => {
        if (!id || !selectedCriterio || newCriterio.peso <= 0) {
            setError("Selecione um critério e insira um peso válido.");
            setTimeout(() => setError(null), 5000);
            return;
        }
        
        // Verificar se o critério já está na lista atual
        const criterioJaExiste = criterios.some(c => c.id === selectedCriterio.value);
        if (criterioJaExiste) {
            setError("Este critério já está na lista de critérios do edital.");
            setTimeout(() => setError(null), 5000);
            return;
        }
        
        await handleSalvarPesoCriterio(selectedCriterio.value, newCriterio.peso);
        setSuccessMessage("Critério adicionado com sucesso!");
        setTimeout(() => setSuccessMessage(null), 3000);

        // Reset and refresh
        handleCloseAddModal();
        fetchCriteriosProjeto(id);

    }, [id, selectedCriterio, newCriterio.peso, criterios, handleSalvarPesoCriterio, fetchCriteriosProjeto, handleCloseAddModal]);

    const handleCreateAndAdd = useCallback(async () => {
        if (!newCriterio.item.trim()) {
            setError("Digite o nome do critério.");
            setTimeout(() => setError(null), 5000);
            return;
        }
        
        if (newCriterio.peso <= 0) {
            setError("Insira um peso válido maior que zero.");
            setTimeout(() => setError(null), 5000);
            return;
        }
        
        try {
            const novoCriterio = await createCriterioProjeto({ item: newCriterio.item, descricao: newCriterio.descricao });
            if (novoCriterio) {
                await handleSalvarPesoCriterio(novoCriterio.id, newCriterio.peso);
                setSuccessMessage("Novo critério criado e adicionado com sucesso!");
                setTimeout(() => setSuccessMessage(null), 3000);

                // Reset and refresh
                handleCloseAddModal();
                fetchCriteriosProjeto(id!);
            }
        } catch(e) { 
            // Erro já tratado no hook
            if (e instanceof Error && e.message.includes('já existe')) {
                setError("Este critério já existe. Selecione-o da lista em vez de criar um novo.");
                setTimeout(() => setError(null), 5000);
            }
        }
    }, [id, newCriterio, createCriterioProjeto, handleSalvarPesoCriterio, fetchCriteriosProjeto, handleCloseAddModal]);

    // Função para remover critério
    const handleRemoveCriterio = useCallback(async (criterioId: number) => {
        if (!window.confirm('Tem certeza que deseja remover este critério?')) return;
        try {
            setLoading(true);
            await removerCriterioProjeto(id!, criterioId);
            setSuccessMessage('Critério removido com sucesso!');
            setTimeout(() => setSuccessMessage(null), 3000);
            await fetchCriteriosProjeto(id!);
        } catch (error) {
            setError('Erro ao remover critério');
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }, [id, removerCriterioProjeto, fetchCriteriosProjeto]);

    if (apiLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-text-secondary">Carregando critérios de avaliação...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto">
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

                <Card className="liquid-card p-6">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Avaliação de Projetos</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Configure o formulário com os critérios e pesos para a avaliação do projeto.
                            </p>
                        </div>
                        <Button
                            onClick={handleOpenAddModal}
                            variant="primary"
                            className="flex items-center"
                            disabled={loading}
                        >
                            <Plus size={16} className="mr-2" />
                            Adicionar Critério
                        </Button>
                    </div>

                    <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {/* Tabela de critérios */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descrição</th>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Peso</th>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    {criterios.map((criterio) => (
                                        <tr key={criterio.id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                            <td className="px-6 py-4">
                                                {editingId === criterio.id ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.item}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, item: e.target.value }))}
                                                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <span className="font-medium text-gray-900 dark:text-white">{criterio.item}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingId === criterio.id ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.descricao}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, descricao: e.target.value }))}
                                                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <span className="text-gray-900 dark:text-white">{criterio.descricao}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingId === criterio.id ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.1"
                                                        value={editForm.peso}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <span className="text-gray-900 dark:text-white">{criterio.peso}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {editingId === criterio.id ? (
                                                    <div className="flex justify-end space-x-2">
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
                                                            disabled={loading}
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(criterio)}
                                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                            disabled={loading}
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveCriterio(criterio.id)}
                                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                            disabled={loading}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {criterios.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p>Nenhum critério configurado ainda.</p>
                                <p className="text-sm mt-1">Clique em "Adicionar Critério" para começar.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 flex justify-start pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link to={`/editais/${id}/configurar`}>
                            <Button variant="secondary" type="button">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar para o Hub
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Modal para adicionar critério */}
            <Modal
                isOpen={showAddModal}
                onClose={handleCloseAddModal}
                title="Adicionar Critério"
            >
                <div className="space-y-6">
                    {/* Campo Item com dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Item
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={isCreatingNew ? "Digite o nome do novo critério..." : "Clique para selecionar ou digite para criar novo..."}
                                value={newCriterio.item}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setNewCriterio(prev => ({ ...prev, item: value }));
                                    
                                    // Se o usuário digitar, limpa a seleção existente
                                    if (value && selectedCriterio) {
                                        setSelectedCriterio(null);
                                    }
                                    
                                    // Se o usuário limpar o campo, limpa tudo
                                    if (!value) {
                                        setSelectedCriterio(null);
                                        setNewCriterio({ item: '', descricao: '', peso: 0 });
                                        setIsCreatingNew(false);
                                    }
                                }}
                                onFocus={() => {
                                    // Mostra o dropdown quando o campo recebe foco (apenas se não estiver criando novo)
                                    if (!newCriterio.item && !isCreatingNew) {
                                        setNewCriterio(prev => ({ ...prev, item: '' }));
                                    }
                                }}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                    isCreatingNew 
                                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600' 
                                        : 'border-gray-300 cursor-pointer'
                                }`}
                            />
                            
                            {/* Dropdown de opções - apenas se não estiver criando novo */}
                            {!isCreatingNew && (!newCriterio.item || newCriterio.item.length < 2) && (
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                                    {/* Opção para criar novo no topo */}
                                    <button
                                        onClick={() => {
                                            setSelectedCriterio(null);
                                            setIsCreatingNew(true);
                                            setNewCriterio(prev => ({ ...prev, item: '', descricao: '', peso: 0 }));
                                        }}
                                        className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between"
                                    >
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            ✨ Criar novo critério
                                        </span>
                                        <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                            Novo
                                        </span>
                                    </button>
                                    
                                    {/* Lista de critérios existentes */}
                                    {disponiveisCriteriosProjeto.slice(0, 8).map((criterio) => (
                                        <button
                                            key={criterio.id}
                                            onClick={() => {
                                                setSelectedCriterio({ value: criterio.id, label: `${criterio.item} - ${criterio.descricao}`, data: criterio });
                                                setNewCriterio({
                                                    item: criterio.item,
                                                    descricao: criterio.descricao,
                                                    peso: 0
                                                });
                                                setIsCreatingNew(false);
                                            }}
                                            className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 flex items-center justify-between"
                                        >
                                            <div className="text-left">
                                                <div className="text-sm font-medium">{criterio.item}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{criterio.descricao}</div>
                                            </div>
                                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                Existente
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            {/* Dropdown de busca quando digita - apenas se não estiver criando novo */}
                            {!isCreatingNew && newCriterio.item && newCriterio.item.length >= 2 && !selectedCriterio && (
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                                    {/* Opção para criar novo com o texto digitado */}
                                    <button
                                        onClick={() => {
                                            setSelectedCriterio(null);
                                            setIsCreatingNew(true);
                                            // Mantém o que o usuário digitou
                                        }}
                                        className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between"
                                    >
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            ✨ "{newCriterio.item}" - Criar novo critério
                                        </span>
                                        <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                            Novo
                                        </span>
                                    </button>
                                    
                                    {/* Sugestões filtradas */}
                                    {disponiveisCriteriosProjeto
                                        .filter(c => 
                                            c.item.toLowerCase().includes(newCriterio.item.toLowerCase()) ||
                                            c.descricao.toLowerCase().includes(newCriterio.item.toLowerCase())
                                        )
                                        .slice(0, 5)
                                        .map((criterio) => (
                                            <button
                                                key={criterio.id}
                                                onClick={() => {
                                                    setSelectedCriterio({ value: criterio.id, label: `${criterio.item} - ${criterio.descricao}`, data: criterio });
                                                    setNewCriterio({
                                                        item: criterio.item,
                                                        descricao: criterio.descricao,
                                                        peso: 0
                                                    });
                                                    setIsCreatingNew(false);
                                                }}
                                                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 flex items-center justify-between"
                                            >
                                                <div className="text-left">
                                                    <div className="text-sm font-medium">{criterio.item}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{criterio.descricao}</div>
                                                </div>
                                                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                    Existente
                                                </span>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Dica informativa */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {isCreatingNew 
                                ? "💡 Modo de criação ativo - preencha os campos abaixo"
                                : "💡 Clique no campo para ver opções ou digite para buscar"
                            }
                        </p>
                    </div>

                    {/* Campo Peso */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Peso
                        </label>
                        <input
                            type="number"
                            placeholder="Ex: 10.0"
                            min="0"
                            step="0.1"
                            value={newCriterio.peso}
                            onChange={(e) => setNewCriterio(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Campo Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Descrição
                        </label>
                        <textarea
                            placeholder="Descreva o critério de avaliação..."
                            value={newCriterio.descricao}
                            onChange={(e) => setNewCriterio(prev => ({ ...prev, descricao: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                        />
                    </div>

                    {/* Indicador de tipo */}
                    {selectedCriterio ? (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 dark:text-blue-400 text-xs">✓</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            Critério Existente Selecionado
                                        </p>
                                        <p className="text-xs text-blue-600 dark:text-blue-300">
                                            Este critério já existe no sistema
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedCriterio(null);
                                        setNewCriterio({ item: '', descricao: '', peso: 0 });
                                    }}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                                >
                                    Escolher outro
                                </button>
                            </div>
                        </div>
                    ) : isCreatingNew ? (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 dark:text-green-400 text-xs">+</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                            Modo de Criação Ativo
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-300">
                                            Você está criando um novo critério personalizado
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCreatingNew(false);
                                        setNewCriterio({ item: '', descricao: '', peso: 0 });
                                    }}
                                    className="text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline"
                                >
                                    Voltar para seleção
                                </button>
                            </div>
                        </div>
                    ) : newCriterio.item && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                                        <span className="text-yellow-600 dark:text-yellow-400 text-xs">?</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        Novo Critério (Assumido)
                                    </p>
                                    <p className="text-xs text-yellow-600 dark:text-yellow-300">
                                        Clique em "Criar novo" para confirmar ou selecione um existente
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botões de ação */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="secondary"
                            onClick={handleCloseAddModal}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={selectedCriterio ? handleAddExistente : handleCreateAndAdd}
                            disabled={
                                loading || 
                                !newCriterio.item || 
                                !newCriterio.descricao || 
                                newCriterio.peso <= 0
                            }
                            variant="primary"
                            className="flex items-center"
                        >
                            <Plus size={16} className="mr-2" />
                            {selectedCriterio ? 'Adicionar Critério Existente' : 'Criar e Adicionar Novo Critério'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AvaliacaoProjetos; 