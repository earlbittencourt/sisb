import React, { useState } from 'react';
import { ItemAvaliacao, ItemAvaliacaoRelatorio } from '../../../../types/relatorio';
import Button from '../../../../components/ui/Button';
import { Plus, Trash2, AlertCircle, CheckCircle, MoreVertical, Edit3 } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Modal from '../../../../components/ui/Modal';
import DataTable from '../../../../components/ui/DataTable';
import Select from '../../../../components/ui/Select';

interface GerenciarItensAvaliacaoProps {
  titulo: string;
  descricao: string;
  masterList: ItemAvaliacao[];
  selectedList: ItemAvaliacaoRelatorio[];
  onAdd: (itemId: number, variacaoNota: string) => Promise<void>;
  onUpdate: (itemId: number, variacaoNota: string) => Promise<void>;
  onRemove: (itemId: number) => Promise<void>;
  loading: boolean;
}

const GerenciarItensAvaliacao: React.FC<GerenciarItensAvaliacaoProps> = ({
  titulo,
  descricao,
  masterList,
  selectedList,
  onAdd,
  onUpdate,
  onRemove,
  loading
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [variacaoNota, setVariacaoNota] = useState('');
  const [feedback, setFeedback] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });

  // Atualiza campos de edição/adicionar ao mudar selectedList
  React.useEffect(() => {
    // Reset quando selectedList mudar
  }, [selectedList]);

  const handleExcluir = async (itemId: number) => {
    try {
      await onRemove(itemId);
      showFeedback('success', 'Item removido com sucesso!');
    } catch (error) {
      showFeedback('error', 'Erro ao remover item');
    }
  };

  const handleEditar = (item: ItemAvaliacaoRelatorio) => {
    setVariacaoNota(item.variacaoNota);
  };

  const handleAdd = async () => {
    if (!selectedItemId || !variacaoNota) return;
    
    try {
      await onAdd(selectedItemId, variacaoNota);
      showFeedback('success', 'Item adicionado com sucesso!');
      setShowModal(false);
      setSelectedItemId(null);
      setVariacaoNota('');
    } catch (error) {
      showFeedback('error', 'Erro ao adicionar item');
    }
  };

  // Itens disponíveis para adicionar
  const disponiveis = masterList.filter(m => !selectedList.some(i => i.itemId === m.id));

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => setFeedback(prev => ({ ...prev, show: false })), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{titulo}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{descricao}</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
          icon={Plus}
        >
          Adicionar Item
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <DataTable
          columns={[
            { key: 'criterio', label: 'CRITÉRIO DE AVALIAÇÃO' },
            { key: 'nota', label: 'VARIAÇÃO DA NOTA', className: 'text-right' },
            { key: 'acoes', label: 'AÇÕES' }
          ]}
          data={selectedList.map(item => ({
            criterio: (
              <div>
                <p className="font-semibold text-neutral-800 dark:text-slate-100">
                  {item.itemDescricao || (masterList.find(m => m.id === item.itemId)?.descricao ?? '—')}
                </p>
              </div>
            ),
            nota: (
              <span className="block text-right">{item.variacaoNota}</span>
            ),
            acoes: (
              <Menu as="div" className="relative">
                <Menu.Button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                    <div className="p-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleEditar(item)}
                            className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150`}
                          >
                            <Edit3 className="w-4 h-4 mr-3" />
                            Editar
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleExcluir(item.id)}
                            className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors duration-150`}
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            Excluir
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )
          }))}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Adicionar Item"
        variant="glass"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Item
            </label>
            <Select
              options={disponiveis.map(item => ({
                value: item.id.toString(),
                label: item.descricao
              }))}
              value={selectedItemId?.toString() || ''}
              onChange={(value) => setSelectedItemId(value ? Number(value) : null)}
              placeholder="Selecione um item..."
            />
          </div>

          {selectedItemId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Variação da Nota
              </label>
              <input
                type="text"
                value={variacaoNota}
                onChange={(e) => setVariacaoNota(e.target.value)}
                className="w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md"
                placeholder="Ex: 0-5"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAdd}
              disabled={!selectedItemId || !variacaoNota}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>

      {feedback.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white flex items-center space-x-2`}>
          {feedback.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
};

export default GerenciarItensAvaliacao; 