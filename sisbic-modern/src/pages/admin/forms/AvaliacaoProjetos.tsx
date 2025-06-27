import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { useAvaliacao } from '../../../hooks/useAvaliacao';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from '../../../components/ui/Select';
import { cn } from '../../../lib/utils';

interface CriterioProjeto {
    id: number;
    item: string;
    descricao: string;
    peso: number;
}

const AvaliacaoProjetos: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { 
        criteriosProjeto,
        subAreas,
        itensAvaliacao,
        fetchCriteriosProjeto,
        fetchSubAreas,
        fetchItensAvaliacao,
        loading: apiLoading,
        error: apiError,
        salvarPesoCriterio,
        disponiveisCriteriosProjeto,
        fetchDisponiveisCriteriosProjeto,
        removerCriterioProjeto,
        createCriterioProjeto
    } = useAvaliacao();
    const [criteriosProjetoLocal, setCriteriosProjetoLocal] = useState<CriterioProjeto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ item: '', descricao: '', peso: 0 });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCriterio, setNewCriterio] = useState<{
        item: string;
        descricao: string;
        peso: number;
    }>({
        item: '',
        descricao: '',
        peso: 0
    });
    const [selectedCriterio, setSelectedCriterio] = useState<CriterioProjeto | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showSelectModal, setShowSelectModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [criterioToDelete, setCriterioToDelete] = useState<CriterioProjeto | null>(null);

    useEffect(() => {
        if (id) {
            fetchCriteriosProjeto(parseInt(id));
            fetchSubAreas();
            fetchItensAvaliacao(parseInt(id));
        }
    }, [id, fetchCriteriosProjeto, fetchSubAreas, fetchItensAvaliacao]);

    // Sincronizar dados da API com estado local
    useEffect(() => {
        if (criteriosProjeto.length > 0) {
            setCriteriosProjetoLocal(criteriosProjeto);
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
            await salvarPesoCriterio(parseInt(id), criterioId, peso);
            setSuccessMessage('Peso atualizado com sucesso!');
            setTimeout(() => setSuccessMessage(null), 3000);
            // Recarregar critérios para atualizar os pesos
            await fetchCriteriosProjeto(parseInt(id));
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
            fetchDisponiveisCriteriosProjeto(parseInt(id));
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
        const criterioJaExiste = criteriosProjetoLocal.some(c => c.id === selectedCriterio.id);
        if (criterioJaExiste) {
            setError("Este critério já está na lista de critérios do edital.");
            setTimeout(() => setError(null), 5000);
            return;
        }
        
        await handleSalvarPesoCriterio(selectedCriterio.id, newCriterio.peso);
        setSuccessMessage("Critério adicionado com sucesso!");
        setTimeout(() => setSuccessMessage(null), 3000);

        // Reset and refresh
        handleCloseAddModal();
        fetchCriteriosProjeto(parseInt(id));

    }, [id, selectedCriterio, newCriterio.peso, criteriosProjetoLocal, handleSalvarPesoCriterio, fetchCriteriosProjeto, handleCloseAddModal]);

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
            const novoCriterio = await createCriterioProjeto({
                item: newCriterio.item,
                descricao: newCriterio.descricao
            });

            if (novoCriterio) {
                await handleSalvarPesoCriterio(novoCriterio.id, newCriterio.peso);
                setSuccessMessage("Novo critério criado e adicionado com sucesso!");
                setTimeout(() => setSuccessMessage(null), 3000);

                // Reset and refresh
                handleCloseAddModal();
                fetchCriteriosProjeto(parseInt(id!));
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
            await removerCriterioProjeto(parseInt(id!), criterioId);
            setSuccessMessage('Critério removido com sucesso!');
            setTimeout(() => setSuccessMessage(null), 3000);
            await fetchCriteriosProjeto(parseInt(id!));
        } catch (error) {
            setError('Erro ao remover critério');
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }, [id, removerCriterioProjeto, fetchCriteriosProjeto]);

    const handleConfirmDelete = async () => {
        if (criterioToDelete !== null) {
            await handleRemoveCriterio(criterioToDelete.id);
            setShowConfirmModal(false);
            setCriterioToDelete(null);
        }
    };

    // Função para selecionar um critério existente
    const handleSelectCriterio = (criterio: CriterioProjeto) => {
        setSelectedCriterio(criterio);
        setNewCriterio({
            item: criterio.item,
            descricao: criterio.descricao,
            peso: criterio.peso
        });
        setIsCreatingNew(false);
    };

    // Função para salvar o critério (novo ou existente)
    const handleSaveCriterio = async () => {
        try {
            setLoading(true);
            setError(null);

            if (selectedCriterio) {
                // Adiciona critério existente
                await salvarPesoCriterio(parseInt(id!), selectedCriterio.id, newCriterio.peso);
            } else {
                // Cria novo critério
                const novoCriterio = await createCriterioProjeto({
                    item: newCriterio.item,
                    descricao: newCriterio.descricao
                });
                
                if (novoCriterio) {
                    await salvarPesoCriterio(parseInt(id!), novoCriterio.id, newCriterio.peso);
                }
            }

            // Atualiza a lista
            await fetchCriteriosProjeto(parseInt(id!));
            handleCloseAddModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar critério');
        } finally {
            setLoading(false);
        }
    };

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
                                    {criteriosProjetoLocal.map((criterio) => (
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
                                                            onClick={() => {
                                                                setShowConfirmModal(true);
                                                                setEditingId(criterio.id);
                                                            }}
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

                        {criteriosProjetoLocal.length === 0 && (
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
                variant="glass"
                size="md"
            >
                <div className="space-y-6">
                    {/* Campo de input para critério */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Critério
                        </label>
                        <Select
                            options={[
                                { value: 'new', label: '✨ Criar novo critério' },
                                ...disponiveisCriteriosProjeto.map(c => ({
                                    value: c.id,
                                    label: c.item,
                                    description: c.descricao
                                }))
                            ]}
                            value={selectedCriterio ? selectedCriterio.id : isCreatingNew ? 'new' : ''}
                            onChange={(value) => {
                                if (value === 'new') {
                                    setIsCreatingNew(true);
                                        setSelectedCriterio(null);
                                        setNewCriterio({ item: '', descricao: '', peso: 0 });
                                } else {
                                    const criterio = disponiveisCriteriosProjeto.find(c => c.id === value);
                                    if (criterio) {
                                        setSelectedCriterio(criterio);
                                                setNewCriterio({
                                                    item: criterio.item,
                                                    descricao: criterio.descricao,
                                                    peso: 0
                                                });
                                                setIsCreatingNew(false);
                                    }
                                }
                            }}
                            placeholder="Selecione um critério existente ou crie um novo..."
                        />
                                            </div>

                    {/* Campo de nome do critério (apenas se estiver criando novo) */}
                    {isCreatingNew && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome do Critério
                            </label>
                            <input
                                type="text"
                                placeholder="Digite o nome do critério..."
                                value={newCriterio.item}
                                onChange={(e) => setNewCriterio(prev => ({ ...prev, item: e.target.value }))}
                                className="w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                                </div>
                            )}
                            
                    {/* Campo de descrição (apenas se estiver criando novo) */}
                    {isCreatingNew && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descrição
                            </label>
                            <textarea
                                placeholder="Descreva o critério de avaliação..."
                                value={newCriterio.descricao}
                                onChange={(e) => setNewCriterio(prev => ({ ...prev, descricao: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>
                    )}

                    {/* Campo de peso */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Peso
                        </label>
                        <input
                            type="number"
                            placeholder="Digite o peso..."
                            value={newCriterio.peso || ''}
                            onChange={(e) => setNewCriterio(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.1"
                        />
                    </div>

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
                                (isCreatingNew && (!newCriterio.item || !newCriterio.descricao)) || 
                                (!isCreatingNew && !selectedCriterio) || 
                                newCriterio.peso <= 0
                            }
                            variant="primary"
                        >
                            Adicionar
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal de confirmação de exclusão */}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirmar Exclusão"
                variant="danger"
                size="sm"
            >
                <div className="space-y-4">
                    <p>Tem certeza que deseja remover este critério?</p>
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="secondary"
                            onClick={() => setShowConfirmModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleConfirmDelete}
                        >
                            Confirmar Exclusão
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AvaliacaoProjetos; 