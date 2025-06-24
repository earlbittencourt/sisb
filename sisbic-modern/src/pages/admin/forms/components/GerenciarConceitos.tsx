import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ConceitoRelatorio } from '../../../../types/relatorio';
import { XCircle, PlusCircle, ThumbsUp, ThumbsDown, Circle, Pencil, ChevronLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import { Dialog } from '@headlessui/react';

const formSchema = z.object({
  descricao: z.string().min(3, { message: 'Mínimo de 3 caracteres.' }),
  nivel: z.coerce.number().int({ message: 'Deve ser um número inteiro.' }),
});

type FormData = z.infer<typeof formSchema>;

interface GerenciarConceitosProps {
  titulo: string;
  descricao: string;
  conceitos: ConceitoRelatorio[];
  onAdd: (data: FormData) => Promise<void>;
  onUpdate: (id: number, data: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const nivelOptions = [
  { value: 1, label: 'Máximo' },
  { value: 0, label: 'Intermediário' },
  { value: -1, label: 'Mínimo' },
];

const getNivelLabel = (nivel: number): string => nivelOptions.find(opt => opt.value === nivel)?.label || String(nivel);
const getNivelColor = (nivel: number): string => {
  switch (nivel) {
    case 1: return 'text-green-500';
    case 0: return 'text-yellow-500';
    case -1: return 'text-red-500';
    default: return 'text-gray-500';
  }
};
const getNivelIcon = (nivel: number) => {
    switch (nivel) {
        case 1: return <ThumbsUp className="text-green-500" size={20} />;
        case 0: return <Circle className="text-yellow-500" size={20} />;
        case -1: return <ThumbsDown className="text-red-500" size={20} />;
        default: return <Circle className="text-gray-500" size={20} />;
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

    // Reset form when defaultValues change (i.e., when opening modal for a new or different item)
    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white dark:bg-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        {isEditing ? 'Editar Conceito' : 'Adicionar Novo Conceito'}
                    </Dialog.Title>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                                <input
                                    {...register('descricao')}
                                    id="descricao"
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                                    placeholder="Ex: Satisfatório, Insatisfatório..."
                                />
                                {errors.descricao && <p className="text-sm text-red-500 mt-1">{errors.descricao.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="nivel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nível</label>
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
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};


const GerenciarConceitos: React.FC<GerenciarConceitosProps> = ({ titulo, descricao, conceitos, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConceito, setEditingConceito] = useState<ConceitoRelatorio | null>(null);

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
                await onUpdate(editingConceito.id, data);
            } else {
                await onAdd(data);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Falha ao salvar conceito", error);
            // Poderia mostrar um toast de erro aqui
        }
    };

  return (
    <div className="space-y-6">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              {titulo}
            </h1>
            <p className="text-md text-text-secondary dark:text-text-secondary-dark mt-1">
              {descricao}
            </p>
        </div>
        <div className="flex justify-end">
            <Button variant="warning" onClick={() => handleOpenModal()}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Conceito
            </Button>
        </div>

        <div className="space-y-3">
            {conceitos.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p>Nenhum conceito cadastrado.</p>
                    <p className="text-sm mt-2">Clique em "Adicionar Conceito" para começar.</p>
                </div>
            ) : (
                <ul className="space-y-2">
                {conceitos.map(conceito => (
                    <li key={conceito.id} className="group flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700/60">
                        <div className="flex items-center gap-3">
                            <div className="transition-transform duration-300 hover:scale-125">
                                {getNivelIcon(conceito.nivel)}
                            </div>
                            <p className={`font-semibold ${getNivelColor(conceito.nivel)}`}>
                                {conceito.descricao}
                                <span className="font-normal opacity-90 ml-2">({getNivelLabel(conceito.nivel)})</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(conceito)}>
                                <Pencil className="text-blue-500 hover:text-blue-600 transition-colors" size={18} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onDelete(conceito.id)}>
                                <XCircle className="text-red-500 hover:text-red-600 transition-colors" size={18} />
                            </Button>
                        </div>
                    </li>
                ))}
                </ul>
            )}
        </div>
      
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

 