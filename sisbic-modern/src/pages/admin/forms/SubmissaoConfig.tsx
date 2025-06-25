import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useParams } from 'react-router-dom';
import { Users, FileText, ChevronLeft, Save, Hash } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { api } from '../../../api/config';
import { ProjetoConfiguracao } from '../../../types/projetoConfiguracao';

// Zod Schema for validation
const formSchema = z.object({
    PCF_nmProjetos: z.number().nullable(),
    PCF_nmMinPlanos: z.number().nullable(),
    PCF_nmPlanos: z.number().nullable(),
    PCF_nmAvaliadores: z.number().nullable(),
});

type FormData = z.infer<typeof formSchema>;

const InputField = ({ icon, label, children, error }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            {icon}
            <span className="ml-2">{label}</span>
        </label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
);

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
                        <InputField label="Nº Projetos por Orientador" icon={<Users size={16} />} error={errors.PCF_nmProjetos}>
                            <input type="number" {...register("PCF_nmProjetos", { valueAsNumber: true })} className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" />
                        </InputField>
                        <InputField label="Nº Avaliadores por Projeto" icon={<Users size={16} />} error={errors.PCF_nmAvaliadores}>
                            <input type="number" {...register("PCF_nmAvaliadores", { valueAsNumber: true })} className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" />
                        </InputField>
                        <InputField label="Nº Planos por Projeto (mínimo)" icon={<FileText size={16} />} error={errors.PCF_nmMinPlanos}>
                            <input type="number" {...register("PCF_nmMinPlanos", { valueAsNumber: true })} className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" />
                        </InputField>
                        <InputField label="Nº Planos por Projeto (máximo)" icon={<FileText size={16} />} error={errors.PCF_nmPlanos}>
                            <input type="number" {...register("PCF_nmPlanos", { valueAsNumber: true })} className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" />
                        </InputField>
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