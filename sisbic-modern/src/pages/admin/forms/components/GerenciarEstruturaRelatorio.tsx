import React, { useState, useEffect, Fragment } from 'react';
import { ItemAvaliacao, EstruturaRelatorioCategoria, EstruturaRelatorioItem } from '../../../../types/relatorio';
 
import Button from '../../../../components/ui/Button';
import { Plus, Trash2, ChevronDown, MoreVertical, ChevronRight } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import Modal from '../../../../components/ui/Modal';
import DataTable from '../../../../components/ui/DataTable';
import Select from '../../../../components/ui/Select';

interface GerenciarEstruturaRelatorioProps {
  titulo: string;
  descricao: string;
  categorias: EstruturaRelatorioCategoria[];
  categoriasMaster: ItemAvaliacao[];
  itensMaster: ItemAvaliacao[];
  criteriosMaster: ItemAvaliacao[];
  onAddCategoria: (categoria: EstruturaRelatorioCategoria) => Promise<void>;
  onUpdateCategoria: (categoriaId: number, dados: EstruturaRelatorioCategoria) => Promise<void>;
  onDeleteCategoria: (categoriaId: number) => Promise<void>;
  onAddItem: (categoriaId: number, item: EstruturaRelatorioItem) => Promise<void>;
  onUpdateItem: (categoriaId: number, itemId: number, dados: EstruturaRelatorioItem) => Promise<void>;
  onDeleteItem: (categoriaId: number, itemId: number) => Promise<void>;
  onAddCriterio: (categoriaId: number, itemId: number, criterioId: number) => Promise<void>;
  onRemoveCriterio: (categoriaId: number, itemId: number, criterioId: number) => Promise<void>;
}

// Componente CategoryPanel para o acordeão
interface CategoryPanelProps {
  categoria: EstruturaRelatorioCategoria;
  itensMaster: ItemAvaliacao[];
  criteriosMaster: ItemAvaliacao[];
  isExpanded: boolean;
  onToggle: () => void;
  onAddItem: (categoriaId: number, item: EstruturaRelatorioItem) => Promise<void>;
  onUpdateItem: (categoriaId: number, itemId: number, dados: EstruturaRelatorioItem) => Promise<void>;
  onDeleteItem: (categoriaId: number, itemId: number) => Promise<void>;
  onAddCriterio: (categoriaId: number, itemId: number, criterioId: number) => Promise<void>;
  onRemoveCriterio: (categoriaId: number, itemId: number, criterioId: number) => Promise<void>;
  onDeleteCategoria: (categoriaId: number) => Promise<void>;
  setShowAddCriterioModal: (data: { categoriaId: number; itemId: number } | null) => void;
  setShowConfirmModal: (data: { type: 'categoria' | 'item' | 'criterio'; id: number; categoriaId?: number; itemId?: number } | null) => void;
  setShowAddItemModal: (categoriaId: number | null) => void;
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({
  categoria,
  itensMaster,
  criteriosMaster,
  isExpanded,
  onToggle,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddCriterio,
  onRemoveCriterio,
  onDeleteCategoria,
  setShowAddCriterioModal,
  setShowConfirmModal,
  setShowAddItemModal
}) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (itemId: number) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Cabeçalho do Acordeão */}
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <ChevronDown 
            className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {categoria.descricao}
          </h3>
        </div>
        
        {/* Ações da Categoria */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={(e) => {
              e.stopPropagation();
              setShowAddItemModal(categoria.id);
            }}
            className="px-3 py-1 text-sm font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            title="Adicionar Item"
          >
            Adicionar Item
          </Button>
          
          {/* Menu de Contexto para Ações da Categoria */}
          <Menu as="div" className="relative">
            <Menu.Button 
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                      onClick={() => setShowConfirmModal({ type: 'categoria', id: categoria.id })}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Categoria
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Conteúdo Expansível */}
      {isExpanded && (
        <div className="p-4 bg-white dark:bg-gray-900">
          {categoria.itens && categoria.itens.length > 0 ? (
            <div className="space-y-2">
              {categoria.itens.map(item => {
                const isItemExpanded = expandedItems.includes(item.id);
                return (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {/* Cabeçalho do Item */}
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform duration-300 ${isItemExpanded ? 'rotate-90' : ''}`} 
                        />
                        <span className="font-medium text-gray-800 dark:text-white">
                          {item.descricao}
                        </span>
                      </div>
                      
                      {/* Ações do Item */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Plus}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAddCriterioModal({ categoriaId: categoria.id, itemId: item.id });
                          }}
                          className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
                          title="Adicionar Critério"
                        >
                          <></>
                        </Button>
                        
                        {/* Menu de Contexto para Ações do Item */}
                        <Menu as="div" className="relative">
                          <Menu.Button 
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                    } flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                                    onClick={() => setShowConfirmModal({ 
                                      type: 'item', 
                                      id: item.id, 
                                      categoriaId: categoria.id 
                                    })}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir Item
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>

                    {/* Lista Aninhada de Critérios */}
                    {isItemExpanded && (
                      <div className="pl-8 pr-4 py-3 bg-white dark:bg-gray-900">
                        {item.criterios && item.criterios.length > 0 ? (
                          <div className="space-y-2">
                            {item.criterios.map(criterio => (
                              <div key={criterio.id} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {criterio.descricao}
                                </span>
                                <button
                                  onClick={() => setShowConfirmModal({ 
                                    type: 'criterio', 
                                    id: criterio.id, 
                                    categoriaId: categoria.id, 
                                    itemId: item.id 
                                  })}
                                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                  title="Remover Critério"
                                >
                                  <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500 transition-colors duration-200" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                            <p className="text-sm">Nenhum critério adicionado a este item.</p>
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={Plus}
                              onClick={() => setShowAddCriterioModal({ categoriaId: categoria.id, itemId: item.id })}
                              className="mt-2"
                            >
                              Adicionar Primeiro Critério
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Nenhum item adicionado a esta categoria.</p>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => setShowAddItemModal(categoria.id)}
                className="mt-2"
              >
                Adicionar Primeiro Item
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const GerenciarEstruturaRelatorio: React.FC<GerenciarEstruturaRelatorioProps> = ({
  titulo,
  descricao,
  categorias,
  categoriasMaster,
  itensMaster,
  criteriosMaster,
  onAddCategoria,
  onUpdateCategoria,
  onDeleteCategoria,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddCriterio,
  onRemoveCriterio
}) => {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [showAddCriterioModal, setShowAddCriterioModal] = useState<{ categoriaId: number; itemId: number } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{ type: 'categoria' | 'item' | 'criterio'; id: number; categoriaId?: number; itemId?: number } | null>(null);
  const [selectedCriterioId, setSelectedCriterioId] = useState<string>('');
  const [isCreatingNewCriterio, setIsCreatingNewCriterio] = useState(false);
  const [novoCriterioDescricao, setNovoCriterioDescricao] = useState('');
  const [showAddCategoriaModal, setShowAddCategoriaModal] = useState(false);
  const [novaCategoriaDescricao, setNovaCategoriaDescricao] = useState('');
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>('');
  const [isCreatingNewCategoria, setIsCreatingNewCategoria] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Log para debug das categorias master
  useEffect(() => {
    console.log('categoriasMaster:', categoriasMaster);
    console.log('Opções do Select:', [
      { value: 'new', label: '✨ Criar nova categoria' },
      ...categoriasMaster.map(c => ({ value: c.id, label: c.descricao }))
    ]);
  }, [categoriasMaster]);

  const toggleCategory = (categoriaId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoriaId) 
        ? prev.filter(id => id !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  const handleCloseAddCriterioModal = () => {
    setShowAddCriterioModal(null);
    setSelectedCriterioId('');
    setIsCreatingNewCriterio(false);
    setNovoCriterioDescricao('');
  };

  const handleCloseAddItemModal = () => {
    setShowAddItemModal(null);
    setSelectedItemId(null);
  };

  const handleAddCriterio = async () => {
    if (!showAddCriterioModal) return;

    try {
      if (isCreatingNewCriterio) {
        if (novoCriterioDescricao.trim()) {
          // Lógica para criar novo critério
          console.log('Criando novo critério:', novoCriterioDescricao);
        }
      } else if (selectedCriterioId) {
        await onAddCriterio(showAddCriterioModal.categoriaId, showAddCriterioModal.itemId, parseInt(selectedCriterioId));
      }
      handleCloseAddCriterioModal();
    } catch (error) {
      console.error('Erro ao adicionar critério:', error);
    }
  };

  const handleAddItem = async () => {
    if (!showAddItemModal || !selectedItemId) return;

    try {
      const itemMaster = itensMaster.find(item => item.id === selectedItemId);
      if (itemMaster) {
        const novoItem: EstruturaRelatorioItem = {
          id: itemMaster.id,
          descricao: itemMaster.descricao,
          criterios: []
        };
        await onAddItem(showAddItemModal, novoItem);
        handleCloseAddItemModal();
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const confirmRemove = async () => {
    if (!showConfirmModal) return;

    try {
      switch (showConfirmModal.type) {
        case 'categoria':
          await onDeleteCategoria(showConfirmModal.id);
          break;
        case 'item':
          if (showConfirmModal.categoriaId) {
            await onDeleteItem(showConfirmModal.categoriaId, showConfirmModal.id);
    }
          break;
        case 'criterio':
          if (showConfirmModal.categoriaId && showConfirmModal.itemId) {
            await onRemoveCriterio(showConfirmModal.categoriaId, showConfirmModal.itemId, showConfirmModal.id);
          }
          break;
      }
      setShowConfirmModal(null);
    } catch (error) {
      console.error('Erro ao remover:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{titulo}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{descricao}</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowAddCategoriaModal(true)}
        >
          Adicionar Categoria
        </Button>
      </div>

      {/* Acordeão de Categorias */}
      <div className="space-y-4">
        {categorias.map(categoria => (
          <CategoryPanel
            key={categoria.id}
            categoria={categoria}
            itensMaster={itensMaster}
            criteriosMaster={criteriosMaster}
            isExpanded={expandedCategories.includes(categoria.id)}
            onToggle={() => toggleCategory(categoria.id)}
            onAddItem={onAddItem}
            onUpdateItem={onUpdateItem}
            onDeleteItem={onDeleteItem}
            onAddCriterio={onAddCriterio}
            onRemoveCriterio={onRemoveCriterio}
            onDeleteCategoria={onDeleteCategoria}
            setShowAddCriterioModal={setShowAddCriterioModal}
            setShowConfirmModal={setShowConfirmModal}
            setShowAddItemModal={setShowAddItemModal}
          />
        ))}
      </div>

      {/* Modal de Adicionar Categoria */}
      {showAddCategoriaModal && (
      <Modal
          isOpen={showAddCategoriaModal}
          onClose={() => {
            setShowAddCategoriaModal(false);
            setNovaCategoriaDescricao('');
            setSelectedCategoriaId('');
            setIsCreatingNewCategoria(false);
          }}
        title="Adicionar Categoria"
          variant="glass"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
              <Select
                options={[
                  { value: 'new', label: '✨ Criar nova categoria' },
                  ...categoriasMaster.map(c => ({ value: String(c.id), label: c.descricao }))
                ]}
                value={isCreatingNewCategoria ? 'new' : selectedCategoriaId}
                onChange={(value) => {
                  if (value === 'new') {
                    setIsCreatingNewCategoria(true);
                    setSelectedCategoriaId('');
                  } else {
                    setIsCreatingNewCategoria(false);
                    setSelectedCategoriaId(String(value));
                  }
                }}
                placeholder="Selecione uma categoria ou crie uma nova"
              />
          </div>

            {isCreatingNewCategoria && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Nova Categoria
                </label>
                <input
                  type="text"
                  value={novaCategoriaDescricao}
                  onChange={(e) => setNovaCategoriaDescricao(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Digite o nome da categoria"
                />
              </div>
            )}

          <div className="flex justify-end space-x-2">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowAddCategoriaModal(false);
                  setNovaCategoriaDescricao('');
                  setSelectedCategoriaId('');
                  setIsCreatingNewCategoria(false);
                }}
              >
              Cancelar
            </Button>
            <Button
              variant="primary"
                onClick={async () => {
                  console.log('Botão Adicionar clicado');
                  console.log('isCreatingNewCategoria:', isCreatingNewCategoria);
                  console.log('novaCategoriaDescricao:', novaCategoriaDescricao);
                  console.log('selectedCategoriaId:', selectedCategoriaId);
                  
                  if (isCreatingNewCategoria) {
                    if (novaCategoriaDescricao.trim()) {
                      console.log('Criando nova categoria:', novaCategoriaDescricao);
                      const novaCategoria: EstruturaRelatorioCategoria = {
                        id: Date.now(),
                        descricao: novaCategoriaDescricao.trim(),
                        itens: []
                      };
                      console.log('Nova categoria criada:', novaCategoria);
                      console.log('onAddCategoria function:', onAddCategoria);
                      try {
                        await onAddCategoria(novaCategoria);
                        console.log('Categoria adicionada com sucesso');
                      } catch (error) {
                        console.error('Erro ao adicionar categoria:', error);
                      }
                    }
                  } else {
                    if (selectedCategoriaId) {
                      console.log('Selecionando categoria existente:', selectedCategoriaId);
                      const categoriaMaster = categoriasMaster.find(c => c.id === parseInt(selectedCategoriaId));
                      if (categoriaMaster) {
                        const novaCategoria: EstruturaRelatorioCategoria = {
                          id: categoriaMaster.id,
                          descricao: categoriaMaster.descricao,
                          itens: []
                        };
                        console.log('Categoria master selecionada:', novaCategoria);
                        try {
                          await onAddCategoria(novaCategoria);
                          console.log('Categoria adicionada com sucesso');
                        } catch (error) {
                          console.error('Erro ao adicionar categoria:', error);
                        }
                      }
                    }
                  }
                  setShowAddCategoriaModal(false);
                  setNovaCategoriaDescricao('');
                  setSelectedCategoriaId('');
                  setIsCreatingNewCategoria(false);
                }}
                disabled={isCreatingNewCategoria ? !novaCategoriaDescricao.trim() : !selectedCategoriaId}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>
      )}

      {/* Modal de Adicionar Item */}
      {showAddItemModal && (
      <Modal
          isOpen={!!showAddItemModal}
        onClose={handleCloseAddItemModal}
        title="Adicionar Item"
          variant="glass"
      >
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Item
            </label>
              <Select
                options={itensMaster.map(item => ({
                  value: item.id,
                  label: item.descricao
                }))}
                value={selectedItemId || ''}
                onChange={(value) => setSelectedItemId(value ? Number(value) : null)}
                placeholder="Selecione um item..."
              />
            </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleCloseAddItemModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
                onClick={handleAddItem}
                disabled={!selectedItemId}
              >
                Adicionar
            </Button>
          </div>
        </div>
      </Modal>
      )}

      {/* Modal de Adicionar Critério */}
      {showAddCriterioModal && (
      <Modal
          isOpen={!!showAddCriterioModal}
        onClose={handleCloseAddCriterioModal}
        title="Adicionar Critério"
          variant="glass"
      >
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Critério
            </label>
              <Select
                options={[
                  { value: 'new', label: '✨ Criar novo critério' },
                  ...criteriosMaster.map(c => ({ value: String(c.id), label: c.descricao }))
                ]}
                value={isCreatingNewCriterio ? 'new' : selectedCriterioId}
                onChange={(value) => {
                  if (value === 'new') {
                    setIsCreatingNewCriterio(true);
                    setSelectedCriterioId('');
                  } else {
                    setIsCreatingNewCriterio(false);
                    setSelectedCriterioId(String(value));
                  }
                }}
                placeholder="Selecione um critério ou crie um novo"
              />
          </div>

            {isCreatingNewCriterio && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição do Novo Critério
                </label>
                <input
                  type="text"
                  value={novoCriterioDescricao}
                  onChange={(e) => setNovoCriterioDescricao(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Digite a descrição do critério"
                />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleCloseAddCriterioModal}>
              Cancelar
            </Button>
              <Button variant="primary" onClick={handleAddCriterio}>
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>
      )}

      {/* Modal de Confirmação de Remoção */}
      {showConfirmModal && (
      <Modal
        isOpen={!!showConfirmModal}
        onClose={() => setShowConfirmModal(null)}
          title="Confirmar Remoção"
          variant="glass"
      >
        <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Tem certeza que deseja remover {showConfirmModal.type === 'criterio' ? 'este critério' : showConfirmModal.type === 'item' ? 'este item' : 'esta categoria'}?
              Essa ação não poderá ser desfeita.
          </p>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="primary" 
                onClick={() => setShowConfirmModal(null)}
              >
              Cancelar
            </Button>
              <Button 
                variant="secondary"
                onClick={confirmRemove}
                className="bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
              >
              Remover
            </Button>
          </div>
        </div>
      </Modal>
      )}
    </div>
  );
};

export default GerenciarEstruturaRelatorio; 