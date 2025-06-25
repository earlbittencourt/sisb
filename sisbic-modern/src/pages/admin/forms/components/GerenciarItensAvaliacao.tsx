import React, { useState } from 'react';
import { ItemAvaliacao, ItemAvaliacaoRelatorio } from '../../../../types/relatorio';
import Button from '../../../../components/ui/Button';
import { Plus, Pencil, X } from 'lucide-react';

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

const GerenciarItensAvaliacao: React.FC<GerenciarItensAvaliacaoProps> = ({ titulo, descricao, masterList, selectedList, onAdd, onUpdate, onRemove, loading }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditId, setShowEditId] = useState<number | null>(null);
  const [novaVariacao, setNovaVariacao] = useState('');
  const [novoItemId, setNovoItemId] = useState<number | null>(null);
  const [novaVariacaoAdd, setNovaVariacaoAdd] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Atualiza campos de edição/adicionar ao mudar selectedList
  React.useEffect(() => {
    setShowEditId(null);
    setNovaVariacao('');
    setNovoItemId(null);
    setNovaVariacaoAdd('');
  }, [selectedList]);

  const handleExcluir = async (itemId: number) => {
    setSalvando(true);
    await onRemove(itemId);
    setSalvando(false);
  };

  const handleEditar = (item: ItemAvaliacaoRelatorio) => {
    setShowEditId(item.itemId);
    setNovaVariacao(item.variacaoNota);
  };

  const handleSalvarEdicao = async (itemId: number) => {
    setSalvando(true);
    await onUpdate(itemId, novaVariacao);
    setShowEditId(null);
    setNovaVariacao('');
    setSalvando(false);
  };

  const handleAdicionar = async () => {
    if (novoItemId && novaVariacaoAdd) {
      setSalvando(true);
      await onAdd(novoItemId, novaVariacaoAdd);
      setShowAddModal(false);
      setNovoItemId(null);
      setNovaVariacaoAdd('');
      setSalvando(false);
    }
  };

  // Itens disponíveis para adicionar
  const disponiveis = masterList.filter(m => !selectedList.some(i => i.itemId === m.id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{titulo}</h2>
          <p className="mt-1 text-text-secondary dark:text-text-secondary-dark">{descricao}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={Plus} variant="primary">Adicionar Item</Button>
      </div>

      {/* Lista de itens adicionados */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 text-text-primary dark:text-text-primary-dark">Item</th>
              <th className="py-2 text-text-primary dark:text-text-primary-dark">Variação da Nota</th>
              <th className="py-2 text-right text-text-primary dark:text-text-primary-dark">Ações</th>
            </tr>
          </thead>
          <tbody>
            {selectedList.length === 0 && (
              <tr><td colSpan={3} className="text-center text-text-secondary dark:text-text-secondary-dark py-4">Nenhum item adicionado.</td></tr>
            )}
            {selectedList.map(item => {
              const master = masterList.find(m => m.id === item.itemId);
              return (
                <tr key={item.itemId} className="border-b border-gray-200 dark:border-gray-600">
                  <td className="py-2 font-medium text-text-primary dark:text-text-primary-dark">{master?.descricao || '-'}</td>
                  <td className="py-2">
                    {showEditId === item.itemId ? (
                      <input
                        type="text"
                        value={novaVariacao}
                        onChange={e => setNovaVariacao(e.target.value)}
                        className="px-2 py-1 border rounded w-32 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark border-gray-300 dark:border-gray-600"
                        autoFocus
                      />
                    ) : (
                      <span className="text-text-primary dark:text-text-primary-dark">{item.variacaoNota}</span>
                    )}
                  </td>
                  <td className="py-2 text-right space-x-2">
                    {showEditId === item.itemId ? (
                      <Button size="sm" variant="primary" onClick={() => handleSalvarEdicao(item.itemId)} disabled={salvando}>Salvar</Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleEditar(item)}><Pencil size={16} /></Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleExcluir(item.itemId)} disabled={salvando}><X size={16} /></Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de adicionar item */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-text-primary dark:text-text-primary-dark">Adicionar Item de Avaliação</h3>
            <div className="mb-4">
              <label className="block mb-1 text-text-primary dark:text-text-primary-dark">Item</label>
              <select
                className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark border-gray-300 dark:border-gray-600"
                value={novoItemId || ''}
                onChange={e => setNovoItemId(Number(e.target.value))}
              >
                <option value="">Selecione...</option>
                {disponiveis.map(item => (
                  <option key={item.id} value={item.id}>{item.descricao}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-text-primary dark:text-text-primary-dark">Variação da Nota</label>
              <input
                className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark border-gray-300 dark:border-gray-600"
                type="text"
                value={novaVariacaoAdd}
                onChange={e => setNovaVariacaoAdd(e.target.value)}
                placeholder="Ex: 0 a 10"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancelar</Button>
              <Button variant="primary" onClick={handleAdicionar} disabled={!novoItemId || !novaVariacaoAdd}>Adicionar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciarItensAvaliacao; 