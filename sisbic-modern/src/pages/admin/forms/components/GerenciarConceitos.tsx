import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Plus, MoreVertical, Edit3, CheckCircle, XCircle } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import Modal from '../../../../components/ui/Modal';
import StatusBadge from '../../../../components/ui/StatusBadge';
import { ConceitoRelatorio } from '../../../../types/relatorio';
import DataTable from '../../../../components/ui/DataTable';

const formSchema = z.object({
  descricao: z.string().min(3, { message: 'Mínimo de 3 caracteres.' }),
  nivel: z.coerce.number().int({ message: 'Deve ser um número inteiro.' }),
});

type FormData = z.infer<typeof formSchema>;

interface GerenciarConceitosProps {
  titulo: string;
  descricao: string;
  conceitos: ConceitoRelatorio[];
  onAdd: (conceito: ConceitoRelatorio) => Promise<void>;
  onUpdate: (conceitoId: number, dados: ConceitoRelatorio) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const nivelOptions = [
  { value: -1, label: 'Mínimo' },
  { value: 0, label: 'Intermediário' },
  { value: 1, label: 'Máximo' },
];

const getNivelStatus = (nivel: number): string => {
    switch (nivel) {
        case -1:
            return 'Mínimo';
        case 0:
            return 'Intermediário';
        case 1:
            return 'Máximo';
        default:
            return 'Desconhecido';
    }
};

const ModalConceito: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
    isEditing: boolean;
    defaultValues: FormData;
}> = ({ isOpen, onClose, onSubmit, isEditing, defaultValues }) => {
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmitForm = (data: FormData) => {
        onSubmit(data);
    };

    const handleClose = () => {
        reset(defaultValues);
        onClose();
    }

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditing ? 'Editar Conceito' : 'Adicionar Novo Conceito'}
            variant="glass"
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="descricao" className="block text-sm font-medium mb-1">Descrição</label>
                        <input
                            {...register('descricao')}
                            id="descricao"
                            className="w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ex: Satisfatório, Insatisfatório..."
                        />
                        {errors.descricao && <p className="text-sm text-red-500 mt-1">{errors.descricao.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="nivel" className="block text-sm font-medium mb-1">Nível</label>
                        <Controller
                            name="nivel"
                            control={control}
                            render={({ field }) => <Select value={field.value} onChange={(value) => field.onChange(Number(value))} options={nivelOptions} />}
                        />
                        {errors.nivel && <p className="text-sm text-red-500 mt-1">{errors.nivel.message}</p>}
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <Button type="button" variant="ghost" onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" variant="warning">
                        Salvar
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

const GerenciarConceitos: React.FC<GerenciarConceitosProps> = ({ titulo, descricao, conceitos, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConceito, setEditingConceito] = useState<ConceitoRelatorio | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleOpenModal = (conceito: ConceitoRelatorio | null = null) => {
        setEditingConceito(conceito);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingConceito(null);
    };
    
    const onSubmit = async (data: FormData) => {
        try {
            if (editingConceito) {
                await onUpdate(editingConceito.id, data as ConceitoRelatorio);
                setSuccessMessage('Conceito atualizado com sucesso!');
            } else {
                await onAdd(data as ConceitoRelatorio);
                setSuccessMessage('Conceito adicionado com sucesso!');
            }
            setTimeout(() => setSuccessMessage(null), 3000);
            handleCloseModal();
        } catch (error) {
            setError('Falha ao salvar conceito');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleRemove = async (id: number) => {
        try {
            await onDelete(id);
            setSuccessMessage('Conceito removido com sucesso!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            setError('Falha ao remover conceito');
            setTimeout(() => setError(null), 5000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{titulo}</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{descricao}</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    variant="primary"
                    icon={Plus}
                >
                    Adicionar Conceito
                </Button>
            </div>

            <DataTable
                columns={[
                    { key: 'conceito', label: 'CONCEITO' },
                    { key: 'nivel', label: 'NÍVEL' },
                    { key: 'acoes', label: 'AÇÕES' }
                ]}
                data={conceitos.map(conceito => ({
                    conceito: (
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">{conceito.descricao}</span>
                        </div>
                    ),
                    nivel: (
                        <StatusBadge 
                            status={getNivelStatus(conceito.nivel)} 
                            size="sm"
                        />
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
                                                    onClick={() => handleOpenModal(conceito)}
                                                    className={`${
                                                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    } group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150`}
                                                >
                                                    <Edit3 className="w-4 h-4 mr-3" />
                                                    Editar
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => handleRemove(conceito.id)}
                                                    className={`${
                                                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    } group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors duration-150`}
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

            {/* Feedback Messages */}
            {successMessage && (
                <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-green-500 text-white flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>{successMessage}</span>
                </div>
            )}

            {error && (
                <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-red-500 text-white flex items-center space-x-2">
                    <XCircle className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Modal */}
            <ModalConceito
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={onSubmit}
                isEditing={!!editingConceito}
                defaultValues={editingConceito ? { descricao: editingConceito.descricao, nivel: editingConceito.nivel } : { descricao: '', nivel: 0 }}
            />
        </div>
    );
};

export default GerenciarConceitos;

 