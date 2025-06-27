import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from './Button';
import Modal from './Modal';

const formSchema = z.object({
  descricao: z.string().min(1, 'A descrição é obrigatória'),
  avaliadores: z.number().min(1, 'O número de avaliadores deve ser pelo menos 1'),
});

type FormData = z.infer<typeof formSchema>;

interface ModalCriarRelatorioProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
}

const ModalCriarRelatorio: React.FC<ModalCriarRelatorioProps> = ({ isOpen, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    await onSave(data);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Criar Novo Relatório"
      variant="glass"
      size="md"
    >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            <div>
            <label htmlFor="descricao" className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <input
                id="descricao"
                type="text"
                {...register('descricao')}
              className="w-full px-4 py-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ufba-blue-light"
                placeholder="Ex: Relatório Final"
              />
              {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>}
            </div>
            <div>
            <label htmlFor="avaliadores" className="block text-sm font-medium mb-1">
                Número de Avaliadores
              </label>
              <input
                id="avaliadores"
                type="number"
              {...register('avaliadores', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ufba-blue-light"
                placeholder="Ex: 2"
              />
              {errors.avaliadores && <p className="text-red-500 text-sm mt-1">{errors.avaliadores.message}</p>}
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="warning" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Relatório'}
            </Button>
          </div>
        </form>
    </Modal>
  );
};

export default ModalCriarRelatorio; 