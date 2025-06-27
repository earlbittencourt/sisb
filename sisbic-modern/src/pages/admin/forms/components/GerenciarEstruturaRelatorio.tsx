import React, { useState, useEffect, useRef } from 'react';
import { ItemAvaliacao, EstruturaRelatorioCategoria, EstruturaRelatorioItem } from '../../../../types/relatorio';
import Button from '../../../../components/ui/Button';
import { Save, Plus, Trash2 } from 'lucide-react';
import Modal from '/Users/joaobittencourt/IdeaProjects/Sisb2/sisbic-modern/src/components/ui/Modal';

interface GerenciarEstruturaProps {
  titulo: string;
  descricao: string;
  categoriasMaster: ItemAvaliacao[];
  itensMaster: ItemAvaliacao[];
  criteriosMaster: ItemAvaliacao[];
  estruturaInicial: EstruturaRelatorioCategoria[];
  onSave: (estrutura: EstruturaRelatorioCategoria[]) => Promise<void>;
  loading: boolean;
}

const GerenciarEstruturaRelatorio: React.FC<GerenciarEstruturaProps> = ({
  titulo,
  descricao,
  categoriasMaster,
  itensMaster,
  criteriosMaster,
  estruturaInicial,
  onSave,
  loading
}) => {
  const [estrutura, setEstrutura] = useState<EstruturaRelatorioCategoria[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState<number | null>(null);
  const [showAddCriterioModal, setShowAddCriterioModal] = useState<{ categoriaId: number; itemId: number } | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState<ItemAvaliacao | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemAvaliacao | null>(null);
  const [selectedCriterio, setSelectedCriterio] = useState<ItemAvaliacao | null>(null);
  const [isCreatingNewItem, setIsCreatingNewItem] = useState(false);
  const [isCreatingNewCriterio, setIsCreatingNewCriterio] = useState(false);
  const [newItem, setNewItem] = useState({ descricao: '', criterios: [] as ItemAvaliacao[] });
  const [newCriterio, setNewCriterio] = useState({ descricao: '' });
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{ type: 'categoria' | 'item' | 'criterio'; categoriaId: number; itemId?: number; criterioId?: number } | null>(null);
  const inputItemRef = useRef<HTMLInputElement>(null);
  const [actionMessage, setActionMessage] = useState<{ key: string; type: 'success' | 'error'; message: string } | null>(null);
  const [novaVariacaoAdd, setNovaVariacaoAdd] = useState('');

  useEffect(() => {
    setEstrutura(estruturaInicial);
  }, [estruturaInicial]);

  useEffect(() => {
    if (showAddItemModal !== null && inputItemRef.current) {
      inputItemRef.current.focus();
    }
  }, [showAddItemModal]);

  // Handlers para Categoria
  const handleAddCategoria = async () => {
    if (selectedCategoria && !estrutura.find(c => c.id === selectedCategoria.id)) {
      const novaEstrutura = [...estrutura, { ...selectedCategoria, itens: [] }];
      setEstrutura(novaEstrutura);
      try {
        await onSave(novaEstrutura);
        setActionMessage({ key: `add-categoria-${selectedCategoria.id}`, type: 'success', message: 'Categoria adicionada com sucesso!' });
        setTimeout(() => setActionMessage(null), 2000);
      } catch (err) {
        setEstrutura(estrutura);
        setActionMessage({ key: `add-categoria-${selectedCategoria.id}`, type: 'error', message: 'Erro ao adicionar categoria.' });
        setTimeout(() => setActionMessage(null), 4000);
      }
      setSelectedCategoria(null);
      setShowAddModal(false);
    }
  };

  const handleRemoveCategoria = async (categoriaId: number) => {
    setShowConfirmModal({ type: 'categoria', categoriaId });
  };

  const confirmRemove = async () => {
    if (!showConfirmModal) return;
    if (showConfirmModal.type === 'categoria') {
      const novaEstrutura = estrutura.filter(c => c.id !== showConfirmModal.categoriaId);
      setEstrutura(novaEstrutura);
      try {
        await onSave(novaEstrutura);
        setActionMessage({ key: `remove-categoria-${showConfirmModal.categoriaId}`, type: 'success', message: 'Categoria removida com sucesso!' });
        setTimeout(() => setActionMessage(null), 2000);
      } catch (err) {
        setEstrutura(estrutura);
        setActionMessage({ key: `remove-categoria-${showConfirmModal.categoriaId}`, type: 'error', message: 'Erro ao remover categoria.' });
        setTimeout(() => setActionMessage(null), 4000);
      }
    } else if (showConfirmModal.type === 'item' && showConfirmModal.itemId !== undefined) {
      const novaEstrutura = estrutura.map(cat =>
        cat.id === showConfirmModal.categoriaId
          ? { ...cat, itens: cat.itens.filter(i => i.id !== showConfirmModal.itemId) }
          : cat
      );
      setEstrutura(novaEstrutura);
      try {
        await onSave(novaEstrutura);
        setActionMessage({ key: `remove-item-${showConfirmModal.categoriaId}-${showConfirmModal.itemId}`, type: 'success', message: 'Item removido com sucesso!' });
        setTimeout(() => setActionMessage(null), 2000);
      } catch (err) {
        setEstrutura(estrutura);
        setActionMessage({ key: `remove-item-${showConfirmModal.categoriaId}-${showConfirmModal.itemId}`, type: 'error', message: 'Erro ao remover item.' });
        setTimeout(() => setActionMessage(null), 4000);
      }
    } else if (showConfirmModal.type === 'criterio' && showConfirmModal.itemId !== undefined && showConfirmModal.criterioId !== undefined) {
      const novaEstrutura = estrutura.map(cat => {
        if (cat.id === showConfirmModal.categoriaId) {
          return {
            ...cat,
            itens: cat.itens.map(i => {
              if (i.id === showConfirmModal.itemId) {
                return {
                  ...i,
                  criterios: i.criterios.filter(c => c.id !== showConfirmModal.criterioId)
                };
              }
              return i;
            })
          };
        }
        return cat;
      });
      setEstrutura(novaEstrutura);
      try {
        await onSave(novaEstrutura);
        setActionMessage({ key: `remove-criterio-${showConfirmModal.categoriaId}-${showConfirmModal.itemId}-${showConfirmModal.criterioId}`, type: 'success', message: 'Critério removido com sucesso!' });
        setTimeout(() => setActionMessage(null), 2000);
      } catch (err) {
        setEstrutura(estrutura);
        setActionMessage({ key: `remove-criterio-${showConfirmModal.categoriaId}-${showConfirmModal.itemId}-${showConfirmModal.criterioId}`, type: 'error', message: 'Erro ao remover critério.' });
        setTimeout(() => setActionMessage(null), 4000);
      }
    }
    setShowConfirmModal(null);
  };

  // Handlers para Item
  const handleAddItem = async (categoriaId: number) => {
    if (!selectedItem && !isCreatingNewItem) {
      setError('Selecione um item existente ou crie um novo');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (isCreatingNewItem && !newItem.descricao) {
      setError('Digite o nome do novo item');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!novaVariacaoAdd) {
      setError('Digite a variação da nota');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const novoItem: EstruturaRelatorioItem = isCreatingNewItem
      ? {
          id: Math.max(0, ...itensMaster.map(i => i.id)) + 1, // ID temporário para novos itens
          descricao: newItem.descricao,
          criterios: [],
          variacaoNota: novaVariacaoAdd
        }
      : {
          id: selectedItem!.id,
          descricao: selectedItem!.descricao,
          criterios: [],
          variacaoNota: novaVariacaoAdd
        };

    // Verificar se o item já existe na categoria
    const categoria = estrutura.find(c => c.id === categoriaId);
    if (categoria && categoria.itens.some(i => i.descricao === novoItem.descricao)) {
      setError('Este item já existe nesta categoria');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const novaEstrutura = estrutura.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          itens: [...cat.itens, novoItem]
        };
      }
      return cat;
    });
    setEstrutura(novaEstrutura);
    try {
      await onSave(novaEstrutura);
      setActionMessage({ key: `add-item-${categoriaId}-${novoItem.id}`, type: 'success', message: 'Item adicionado com sucesso!' });
      setTimeout(() => setActionMessage(null), 2000);
    } catch (err) {
      setEstrutura(estrutura);
      setActionMessage({ key: `add-item-${categoriaId}-${novoItem.id}`, type: 'error', message: 'Erro ao adicionar item.' });
      setTimeout(() => setActionMessage(null), 4000);
    }
    setSelectedItem(null);
    setNewItem({ descricao: '', criterios: [] });
    setIsCreatingNewItem(false);
    setShowAddItemModal(null);
  };

  const handleRemoveItem = (categoriaId: number, itemId: number) => {
    setShowConfirmModal({ type: 'item', categoriaId, itemId });
  };

  const handleSave = () => {
    onSave(estrutura);
  };

  const handleCloseAddItemModal = () => {
    setShowAddItemModal(null);
    setSelectedItem(null);
    setNewItem({ descricao: '', criterios: [] });
    setIsCreatingNewItem(false);
  };

  const handleCloseAddCriterioModal = () => {
    setShowAddCriterioModal(null);
    setSelectedCriterio(null);
    setNewCriterio({ descricao: '' });
    setIsCreatingNewCriterio(false);
  };

  const handleAddCriterio = async (categoriaId: number, itemId: number) => {
    if (!selectedCriterio && !isCreatingNewCriterio) {
      setError('Selecione um critério existente ou crie um novo');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (isCreatingNewCriterio && !newCriterio.descricao) {
      setError('Digite o nome do novo critério');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const novoCriterio: ItemAvaliacao = isCreatingNewCriterio
      ? {
          id: Math.max(0, ...criteriosMaster.map(c => c.id)) + 1,
          descricao: newCriterio.descricao
        }
      : selectedCriterio!;

    const novaEstrutura = estrutura.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          itens: cat.itens.map(i => {
            if (i.id === itemId) {
              // Verificar se o critério já existe no item
              if (i.criterios.some(c => c.descricao === novoCriterio.descricao)) {
                setError('Este critério já existe neste item');
                setTimeout(() => setError(null), 3000);
                return i;
              }
              return {
                ...i,
                criterios: [...i.criterios, novoCriterio]
              };
            }
            return i;
          })
        };
      }
      return cat;
    });
    setEstrutura(novaEstrutura);
    try {
      await onSave(novaEstrutura);
      setActionMessage({ key: `add-criterio-${categoriaId}-${itemId}-${novoCriterio.id}`, type: 'success', message: 'Critério adicionado com sucesso!' });
      setTimeout(() => setActionMessage(null), 2000);
    } catch (err) {
      setEstrutura(estrutura);
      setActionMessage({ key: `add-criterio-${categoriaId}-${itemId}-${novoCriterio.id}`, type: 'error', message: 'Erro ao adicionar critério.' });
      setTimeout(() => setActionMessage(null), 4000);
    }
    setSelectedCriterio(null);
    setNewCriterio({ descricao: '' });
    setIsCreatingNewCriterio(false);
    setShowAddCriterioModal(null);
  };

  const handleRemoveCriterio = (categoriaId: number, itemId: number, criterioId: number) => {
    setShowConfirmModal({ type: 'criterio', categoriaId, itemId, criterioId });
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {actionMessage && actionMessage.key.startsWith('add-categoria-') && (
        <div className={`mt-2 text-${actionMessage.type === 'success' ? 'green' : 'red'}-600 text-sm`} role={actionMessage.type === 'success' ? 'status' : 'alert'}>
          {actionMessage.message}
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{titulo}</h2>
          <p className="mt-1 text-text-secondary dark:text-text-secondary-dark">{descricao}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddModal(true)} icon={Plus} variant="secondary">
            Nova Categoria
          </Button>
          <Button onClick={handleSave} disabled={loading} icon={Save} variant="primary">
            {loading ? 'Salvando...' : 'Salvar Estrutura'}
          </Button>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="space-y-6">
        {estrutura.map(categoria => (
          <div key={categoria.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark flex-1 truncate">
                {categoria.descricao}
              </h3>
              <div className="mt-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddItemModal(categoria.id)}
                  icon={Plus}
                  className="w-fit"
                >
                  Novo Item
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={() => handleRemoveCategoria(categoria.id)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex-shrink-0 px-3"
                aria-label="Remover categoria"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Lista de Itens */}
            <div className="space-y-2">
              {categoria.itens.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 mb-2"
                >
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h4 className="font-medium text-text-primary dark:text-text-primary-dark break-words flex-1">
                      {item.descricao}
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(categoria.id, item.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex-shrink-0"
                      aria-label="Excluir item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {/* Lista de Critérios */}
                  <div className="space-y-2 mb-2">
                    {item.criterios.map(criterio => (
                      <div
                        key={criterio.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded"
                      >
                        <span className="text-sm text-text-primary dark:text-text-primary-dark">
                          {criterio.descricao}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveCriterio(categoria.id, item.id, criterio.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          aria-label="Excluir critério"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowAddCriterioModal({ categoriaId: categoria.id, itemId: item.id })}
                      icon={Plus}
                      className="w-fit"
                    >
                      Novo Critério
                    </Button>
                  </div>
                </div>
              ))}
              {categoria.itens.length === 0 && (
                <p className="text-center text-text-secondary dark:text-text-secondary-dark py-4">
                  Nenhum item adicionado nesta categoria.
                </p>
              )}
            </div>
          </div>
        ))}
        {estrutura.length === 0 && (
          <p className="text-center text-text-secondary dark:text-text-secondary-dark py-4">
            Nenhuma categoria adicionada à estrutura.
          </p>
        )}
      </div>

      <div className="mt-4">
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          icon={Plus}
          className="w-fit"
        >
          Nova Categoria
        </Button>
      </div>

      {/* Modal de Adicionar Categoria */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Adicionar Categoria"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark border-gray-300 dark:border-gray-600"
              value={selectedCategoria?.id || ''}
              onChange={(e) => {
                const selected = categoriasMaster.find(c => c.id === Number(e.target.value));
                setSelectedCategoria(selected || null);
              }}
            >
              <option value="">Selecione uma categoria...</option>
              {categoriasMaster
                .filter(c => !estrutura.find(ec => ec.id === c.id))
                .map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.descricao}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAddCategoria}
              disabled={!selectedCategoria}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Adicionar Item */}
      <Modal
        isOpen={showAddItemModal !== null}
        onClose={handleCloseAddItemModal}
        title="Adicionar Item"
      >
        <div className="space-y-6">
          {/* Campo de Item com funcionalidade de busca e criação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Item
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={isCreatingNewItem ? "Digite o nome do novo item..." : "Clique para selecionar ou digite para criar novo..."}
                value={isCreatingNewItem ? newItem.descricao : selectedItem?.descricao || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isCreatingNewItem) {
                    setNewItem(prev => ({ ...prev, descricao: value }));
                  } else {
                    if (value && selectedItem) {
                      setSelectedItem(null);
                    }
                    setNewItem(prev => ({ ...prev, descricao: value }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  isCreatingNewItem && !newItem.descricao && error ? 'border-red-500' : isCreatingNewItem ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600' : 'border-gray-300'
                }`}
                ref={isCreatingNewItem ? inputItemRef : undefined}
              />

              {/* Dropdown de opções - apenas se não estiver criando novo */}
              {!isCreatingNewItem && (!newItem.descricao || newItem.descricao.length < 2) && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {/* Opção para criar novo no topo */}
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setIsCreatingNewItem(true);
                      setNewItem({ descricao: '', criterios: [] });
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      ✨ Criar novo item
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                      Novo
                    </span>
                  </button>

                  {/* Lista de itens existentes */}
                  {itensMaster
                    .filter(item => 
                      !estrutura.some(cat => 
                        cat.itens.some(i => i.id === item.id)
                      )
                    )
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          setNewItem({ descricao: item.descricao, criterios: [] });
                          setIsCreatingNewItem(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                          {item.descricao}
                        </div>
                      </button>
                    ))}
                </div>
              )}

              {/* Dropdown de busca quando digita - apenas se não estiver criando novo */}
              {!isCreatingNewItem && newItem.descricao && newItem.descricao.length >= 2 && !selectedItem && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {/* Opção para criar novo com o texto digitado */}
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setIsCreatingNewItem(true);
                      // Mantém o que o usuário digitou
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      ✨ "{newItem.descricao}" - Criar novo item
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                      Novo
                    </span>
                  </button>

                  {/* Sugestões filtradas */}
                  {itensMaster
                    .filter(i => 
                      i.descricao.toLowerCase().includes(newItem.descricao.toLowerCase()) &&
                      !estrutura.some(cat => 
                        cat.itens.some(item => item.id === i.id)
                      )
                    )
                    .slice(0, 5)
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          setNewItem({ descricao: item.descricao, criterios: [] });
                          setIsCreatingNewItem(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                          {item.descricao}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Campo de Variação da Nota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Variação da Nota
            </label>
            <input
              type="text"
              placeholder="Ex: 0 a 10"
              value={novaVariacaoAdd}
              onChange={e => setNovaVariacaoAdd(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300"
            />
          </div>

          {/* Indicador de tipo */}
          {selectedItem ? (
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
                      Item Existente Selecionado
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      Este item já existe no sistema
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setNewItem({ descricao: '', criterios: [] });
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                >
                  Escolher outro
                </button>
              </div>
            </div>
          ) : (
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
                      Você está criando um novo item personalizado
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCreatingNewItem(false);
                    setNewItem({ descricao: '', criterios: [] });
                  }}
                  className="text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline"
                >
                  Voltar para seleção
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleCloseAddItemModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => showAddItemModal !== null && handleAddItem(showAddItemModal)}
              disabled={
                (!selectedItem && !isCreatingNewItem) ||
                (isCreatingNewItem && (!newItem.descricao || !novaVariacaoAdd)) ||
                (!isCreatingNewItem && !selectedItem) ||
                !novaVariacaoAdd
              }
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              {selectedItem ? 'Adicionar Item Existente' : 'Criar e Adicionar Novo Item'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Adicionar Critério */}
      <Modal
        isOpen={showAddCriterioModal !== null}
        onClose={handleCloseAddCriterioModal}
        title="Adicionar Critério"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Critério
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={isCreatingNewCriterio ? "Digite o nome do novo critério..." : "Clique para selecionar ou digite para criar novo..."}
                value={isCreatingNewCriterio ? newCriterio.descricao : selectedCriterio?.descricao || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isCreatingNewCriterio) {
                    setNewCriterio(prev => ({ ...prev, descricao: value }));
                  } else {
                    if (value && selectedCriterio) {
                      setSelectedCriterio(null);
                    }
                    setNewCriterio(prev => ({ ...prev, descricao: value }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  isCreatingNewCriterio 
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600' 
                    : 'border-gray-300'
                }`}
              />

              {/* Dropdown de opções - apenas se não estiver criando novo */}
              {!isCreatingNewCriterio && (!newCriterio.descricao || newCriterio.descricao.length < 2) && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {/* Opção para criar novo no topo */}
                  <button
                    onClick={() => {
                      setSelectedCriterio(null);
                      setIsCreatingNewCriterio(true);
                      setNewCriterio({ descricao: '' });
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
                  {criteriosMaster
                    .filter(c => {
                      if (!showAddCriterioModal) return false;
                      const item = estrutura
                        .find(cat => cat.id === showAddCriterioModal.categoriaId)
                        ?.itens.find(i => i.id === showAddCriterioModal.itemId);
                      return !item?.criterios.some(ic => ic.id === c.id);
                    })
                    .map((criterio) => (
                      <button
                        key={criterio.id}
                        onClick={() => {
                          setSelectedCriterio(criterio);
                          setNewCriterio({ descricao: criterio.descricao });
                          setIsCreatingNewCriterio(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                          {criterio.descricao}
                        </div>
                      </button>
                    ))}
                </div>
              )}

              {/* Dropdown de busca quando digita */}
              {!isCreatingNewCriterio && newCriterio.descricao && newCriterio.descricao.length >= 2 && !selectedCriterio && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {/* Opção para criar novo com o texto digitado */}
                  <button
                    onClick={() => {
                      setSelectedCriterio(null);
                      setIsCreatingNewCriterio(true);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      ✨ "{newCriterio.descricao}" - Criar novo critério
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                      Novo
                    </span>
                  </button>

                  {/* Sugestões de critérios existentes */}
                  {criteriosMaster
                    .filter(c => {
                      if (!showAddCriterioModal) return false;
                      const item = estrutura
                        .find(cat => cat.id === showAddCriterioModal.categoriaId)
                        ?.itens.find(i => i.id === showAddCriterioModal.itemId);
                      return (
                        !item?.criterios.some(ic => ic.id === c.id) &&
                        c.descricao.toLowerCase().includes(newCriterio.descricao.toLowerCase())
                      );
                    })
                    .slice(0, 5)
                    .map((criterio) => (
                      <button
                        key={criterio.id}
                        onClick={() => {
                          setSelectedCriterio(criterio);
                          setNewCriterio({ descricao: criterio.descricao });
                          setIsCreatingNewCriterio(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                          {criterio.descricao}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Indicador de tipo */}
          {selectedCriterio && (
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
                    setNewCriterio({ descricao: '' });
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                >
                  Escolher outro
                </button>
              </div>
            </div>
          )}

          {/* Feedback de sucesso/erro dentro do modal */}
          {actionMessage && actionMessage.key.startsWith('add-criterio-') && (
            <div className={`mt-2 text-${actionMessage.type === 'success' ? 'green' : 'red'}-600 text-sm`} role={actionMessage.type === 'success' ? 'status' : 'alert'}>
              {actionMessage.message}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleCloseAddCriterioModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (showAddCriterioModal) {
                  await handleAddCriterio(showAddCriterioModal.categoriaId, showAddCriterioModal.itemId);
                  handleCloseAddCriterioModal();
                }
              }}
              disabled={!selectedCriterio && !isCreatingNewCriterio}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmação customizado */}
      <Modal
        isOpen={!!showConfirmModal}
        onClose={() => setShowConfirmModal(null)}
        title="Confirmar remoção"
      >
        <div className="space-y-4">
          <p className="text-text-primary dark:text-text-primary-dark">
            {showConfirmModal?.type === 'categoria' && 'Tem certeza que deseja remover esta categoria e todos os seus itens?'}
            {showConfirmModal?.type === 'item' && 'Tem certeza que deseja remover este item?'}
            {showConfirmModal?.type === 'criterio' && 'Tem certeza que deseja remover este critério?'}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowConfirmModal(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmRemove}>
              Remover
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GerenciarEstruturaRelatorio; 