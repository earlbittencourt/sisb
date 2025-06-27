import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Agencia } from '../../types/agencia';
import Select from './Select';
import Button from './Button';
import Modal from './Modal';

const formSchema = z.object({
  agenciaId: z.number().positive("Selecione uma agência."),
  cotas: z.number().min(1, "O número de cotas deve ser pelo menos 1."),
});

type FormData = z.infer<typeof formSchema>;

interface ModalAdicionarAgenciaProps {
  isOpen: boolean;
  onClose: () => void;
  agenciasDisponiveis: Agencia[];
  editalId: number;
  onAgenciaAdicionada: (editalId: number, agenciaId: number, cotas: number) => Promise<void>;
}

const ModalAdicionarAgencia: React.FC<ModalAdicionarAgenciaProps> = ({ 
  isOpen, 
  onClose, 
  agenciasDisponiveis, 
  editalId,
  onAgenciaAdicionada
}) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await onAgenciaAdicionada(editalId, data.agenciaId, data.cotas);
      reset();
      onClose();
    } catch (error) {
      console.error("Falha ao adicionar agência", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Agência de Fomento"
      variant="glass"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Agência</label>
            <Controller
              name="agenciaId"
              control={control}
              render={({ field }) => (
                <Select
                  options={agenciasDisponiveis.map(a => ({ value: a.AGE_Codigo, label: a.AGE_Descricao }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Selecione uma agência..."
                />
              )}
            />
            {errors.agenciaId && <p className="text-red-500 text-xs mt-1">{errors.agenciaId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bolsas Oferecidas</label>
            <Controller
              name="cotas"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:border-ufba-blue focus:ring-ufba-blue dark:placeholder-gray-400 dark:text-white sm:text-sm"
                  min="1"
                />
              )}
            />
            {errors.cotas && <p className="text-red-500 text-xs mt-1">{errors.cotas.message}</p>}
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 p-4 bg-transparent border-t border-slate-200 dark:border-slate-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalAdicionarAgencia; 