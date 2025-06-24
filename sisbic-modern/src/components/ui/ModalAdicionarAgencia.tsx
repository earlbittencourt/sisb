import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';
import { Agencia } from '../../types/agencia';
import Select from './Select';
import Button from './Button';

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
      // Aqui você pode adicionar um estado de erro para exibir no modal
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Adicionar Agência de Fomento
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
                
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Agência</label>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cotas</label>
                    <Controller
                        name="cotas"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white sm:text-sm"
                            />
                        )}
                    />
                    {errors.cotas && <p className="text-red-500 text-xs mt-1">{errors.cotas.message}</p>}
                  </div>

                  <div className="mt-6 flex justify-end space-x-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                      Salvar
                    </Button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalAdicionarAgencia; 