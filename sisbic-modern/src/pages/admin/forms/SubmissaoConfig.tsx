import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useParams } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { api } from '../../../api/config';
import { ProjetoConfiguracao } from '../../../types/projetoConfiguracao';
import StepperInput from '../../../components/ui/StepperInput';
import { Save, ChevronLeft } from 'lucide-react';

// Zod Schema for validation
const formSchema = z.object({
    PCF_nmProjetos: z.number().nullable(),
    PCF_nmMinPlanos: z.number().nullable(),
    PCF_nmPlanos: z.number().nullable(),
    PCF_nmAvaliadores: z.number().nullable(),
});

type FormData = z.infer<typeof formSchema>;

const SubmissaoConfig: React.FC = () => {
    const { id: editalId } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const fetchConfig = async () => {
            if (!editalId) return;
            try {
                setLoading(true);
                const { data } = await api.get<ProjetoConfiguracao>(`/periodos-programas/${editalId}/configuracao-submissao`);
                reset(data);
            } catch (err) {
                console.error("Erro ao buscar configuração", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [editalId, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            await api.post(`/periodos-programas/${editalId}/configuracao-submissao`, data);
            alert('Configuração salva com sucesso!');
        } catch (err) {
            console.error("Erro ao salvar configuração", err);
            alert('Falha ao salvar configuração.');
        }
    };
    
    if (loading) {
        return <div className="p-4">Carregando configurações...</div>;
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Configuração da Submissão
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Defina os limites de projetos, planos e avaliadores.
                        </p>
                    </div>
                    <Button type="submit" variant="primary">
                        <Save size={18} className="mr-2" />
                        Salvar Alterações
                    </Button>
                </div>

                <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        <Controller
                          name="PCF_nmProjetos"
                          control={control}
                          render={({ field }) => (
                            <StepperInput
                              label="Nº Projetos por Orientador"
                              value={field.value || 0}
                              onChange={field.onChange}
                              min={0}
                              error={errors.PCF_nmProjetos?.message}
                            />
                          )}
                        />
                        <Controller
                          name="PCF_nmAvaliadores"
                          control={control}
                          render={({ field }) => (
                            <StepperInput
                              label="Nº Avaliadores por Projeto"
                              value={field.value || 0}
                              onChange={field.onChange}
                              min={0}
                              error={errors.PCF_nmAvaliadores?.message}
                            />
                          )}
                        />
                        <Controller
                          name="PCF_nmMinPlanos"
                          control={control}
                          render={({ field }) => (
                            <StepperInput
                              label="Nº Planos por Projeto (mínimo)"
                              value={field.value || 0}
                              onChange={field.onChange}
                              min={0}
                              error={errors.PCF_nmMinPlanos?.message}
                            />
                          )}
                        />
                        <Controller
                          name="PCF_nmPlanos"
                          control={control}
                          render={({ field }) => (
                            <StepperInput
                              label="Nº Planos por Projeto (máximo)"
                              value={field.value || 0}
                              onChange={field.onChange}
                              min={0}
                              error={errors.PCF_nmPlanos?.message}
                            />
                          )}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-start">
                    <Link to={`/editais/${editalId}/configurar`}>
                        <Button variant="secondary" type="button">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Voltar para o Hub
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SubmissaoConfig; 