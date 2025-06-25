import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEdital } from '../../../contexts/EditalContext';
import { Plus, ChevronLeft, Trash2, Edit, Save, XCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import ModalAdicionarAgencia from '../../../components/ui/ModalAdicionarAgencia';
import { api } from '../../../api/config';
import { EditalAgencia, Agencia } from '../../../types/agencia';
import { useAgencias } from '../../../hooks/useAgencias';

const AgenciasFomento: React.FC = () => {
    const { id: editalId } = useParams<{ id: string }>();
    const { agenciasDoEdital, fetchEditalData, loading, error } = useEdital();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Hook para buscar a lista de todas as agências disponíveis
    const { agencias: todasAgencias, buscarAgencias } = useAgencias();
    
    useEffect(() => {
        buscarAgencias(); // Busca todas as agências para popular o modal
    }, [buscarAgencias]);

    // Estados para controlar a edição em linha
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingCota, setEditingCota] = useState<number>(0);

    const handleEdit = (agencia: EditalAgencia) => {
        setEditingId(agencia.AGB_Codigo_AGE);
        setEditingCota(agencia.AGB_Cota);
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleSave = async (agencia: EditalAgencia) => {
        if (editingCota < agencia.BolsasUtilizadas) {
            alert(`O número de cotas não pode ser inferior às bolsas já utilizadas (${agencia.BolsasUtilizadas}).`);
            return;
        }

        try {
            await api.put(`/periodos-programas/${editalId}/agencias/${agencia.AGB_Codigo_AGE}`, {
                cotas: editingCota
            });
            if (editalId) {
                fetchEditalData(editalId);
            }
            setEditingId(null);
        } catch (err) {
            console.error("Falha ao atualizar as cotas", err);
            alert("Não foi possível atualizar as cotas da agência.");
        }
    };
    
    const handleDelete = async (agenciaId: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta agência do edital? Esta ação não pode ser desfeita.')) {
            try {
                await api.delete(`/periodos-programas/${editalId}/agencias/${agenciaId}`);
                if (editalId) {
                    fetchEditalData(editalId);
                }
            } catch (err) {
                console.error("Erro ao excluir agência", err);
                alert('Falha ao excluir a agência.');
            }
        }
    };

    const handleAdicionarAgencia = async (agenciaId: number, cotas: number) => {
        if (!editalId) return Promise.reject("ID do edital não encontrado");
        try {
            await api.post(`/periodos-programas/${editalId}/agencias`, { agenciaId, cotas });
            fetchEditalData(editalId);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Erro ao adicionar agência", err);
            alert('Falha ao adicionar a agência.');
            throw err; // Lança o erro para que o formulário do modal saiba que falhou
        }
    };

    if (loading) {
        return <div className="p-4">Carregando agências...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Erro ao carregar agências: {error}</div>;
    }
    
    // Filtra as agências que já foram adicionadas a este edital
    const agenciasDisponiveis = todasAgencias.filter(
        agencia => !agenciasDoEdital.some(a => a.AGB_Codigo_AGE === agencia.AGE_Codigo)
    );

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            {isModalOpen && editalId && (
                 <ModalAdicionarAgencia
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAgenciaAdicionada={(agenciaId, cotas) => handleAdicionarAgencia(agenciaId, cotas)}
                    agenciasDisponiveis={agenciasDisponiveis}
                    editalId={Number(editalId)}
                 />
            )}

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Agências de Fomento
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Gerencie as agências e suas respectivas cotas de bolsas para este edital.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} variant="primary">
                    <Plus size={18} className="mr-2" />
                    Adicionar Agência
                </Button>
            </div>
            
            <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agência</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cotas Oferecidas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bolsas Utilizadas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {agenciasDoEdital.map((agencia) => (
                            <tr key={agencia.AGB_Codigo_AGE}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{agencia.AGE_Sigla}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{agencia.AGE_Descricao}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingId === agencia.AGB_Codigo_AGE ? (
                                        <input
                                            type="number"
                                            value={editingCota}
                                            onChange={(e) => setEditingCota(Number(e.target.value))}
                                            className="w-20 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm"
                                        />
                                    ) : (
                                        <div className="text-sm text-gray-900 dark:text-white">{agencia.AGB_Cota}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {agencia.BolsasUtilizadas || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {editingId === agencia.AGB_Codigo_AGE ? (
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => handleSave(agencia)} className="text-green-600 hover:text-green-800">
                                                <Save size={20} />
                                            </button>
                                            <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-3">
                                            <button onClick={() => handleEdit(agencia)} className="text-indigo-600 hover:text-indigo-900" title="Editar Cotas">
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            {(agencia.BolsasUtilizadas === null || agencia.BolsasUtilizadas === 0) && (
                                                <button onClick={() => handleDelete(agencia.AGB_Codigo_AGE)} className="text-red-600 hover:text-red-900" title="Excluir Agência">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

            <div className="mt-6 flex justify-start pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link to={`/editais/${editalId}/configurar`}>
                    <Button variant="secondary">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Voltar para o Hub
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default AgenciasFomento; 