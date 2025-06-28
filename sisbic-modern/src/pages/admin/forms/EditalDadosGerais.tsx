import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft } from 'lucide-react';

import Button from '../../../components/ui/Button';
import InputField from '../../../components/ui/InputField';
import SelectField from '../../../components/ui/SelectField';
import { DatePicker } from '../../../components/ui/DatePicker';
import { useProgramas } from '../../../hooks/useProgramas';
import { useStatus } from '../../../hooks/useStatus';
import { useEdital } from '../../../contexts/EditalContext';
import { criarPeriodoPrograma } from '../../../api/periodosProgramas';

// Zod Schema for validation
const formSchema = z.object({
    PEP_Descricao: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres."),
    PEP_Sigla: z.string().min(3, "A sigla deve ter pelo menos 3 caracteres."),
    PEP_Codigo_PRO: z.number().int().positive("Selecione um programa."),
    PEP_Codigo_PPS: z.number().int().positive("Selecione um status."),
    PEP_DtInicio: z.date().min(new Date('2000-01-01'), "Data inválida"),
    PEP_DtFim: z.date().min(new Date('2000-01-01'), "Data inválida"),
    PEP_Edital: z.string().min(1, "O nome do edital é obrigatório.")
});

type FormData = z.infer<typeof formSchema>;

const EditalDadosGerais: React.FC = () => {
    const navigate = useNavigate();
    const { periodo, loading: editalLoading } = useEdital();
    const { programas, buscarProgramas, loading: programasLoading } = useProgramas();
    const { status: statusList, buscarStatus, loading: statusLoading } = useStatus();

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            PEP_Descricao: '',
            PEP_Sigla: '',
            PEP_Codigo_PRO: undefined,
            PEP_Codigo_PPS: undefined,
            PEP_DtInicio: undefined,
            PEP_DtFim: undefined,
            PEP_Edital: undefined
        }
    });

    useEffect(() => {
        // Busca os dados para os selects
        buscarProgramas();
        buscarStatus();
    }, [buscarProgramas, buscarStatus]);
    
    useEffect(() => {
        if (periodo) {
            reset({
                PEP_Descricao: periodo.PEP_Descricao || '',
                PEP_Sigla: periodo.PEP_Sigla || '',
                PEP_Codigo_PRO: typeof periodo.PEP_Codigo_PRO === 'number' ? periodo.PEP_Codigo_PRO : undefined,
                PEP_Codigo_PPS: typeof periodo.PEP_Codigo_PPS === 'number' ? periodo.PEP_Codigo_PPS : undefined,
                PEP_DtInicio: periodo.PEP_DtInicio ? new Date(periodo.PEP_DtInicio) : undefined,
                PEP_DtFim: periodo.PEP_DtFim ? new Date(periodo.PEP_DtFim) : undefined,
                PEP_Edital: periodo.PEP_Edital || undefined
            });
        }
    }, [periodo, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            const payload = {
                PEP_Codigo: 0, // Valor inicial para novo edital
                PEP_Sigla: data.PEP_Sigla,
                PEP_Descricao: data.PEP_Descricao,
                PEP_DtInicio: data.PEP_DtInicio.toISOString(),
                PEP_DtFim: data.PEP_DtFim.toISOString(),
                PEP_Codigo_PRO: data.PEP_Codigo_PRO,
                PEP_Codigo_PPS: data.PEP_Codigo_PPS,
                PEP_Edital: data.PEP_Edital
            };
            await criarPeriodoPrograma(payload);
            alert('Edital criado com sucesso!');
            navigate('/editais');
        } catch (err) {
            alert('Erro ao criar edital.');
            console.error(err);
        }
    };
    
    const loading = editalLoading || programasLoading || statusLoading;

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-text-secondary">Carregando dados do edital...</p>
                </div>
            </div>
        );
    }

    // Preparar opções para os selects
    const programaOptions = programas.map(programa => ({
        value: programa.PRO_Codigo || 0,
        label: `${programa.PRO_Sigla} - ${programa.PRO_Descricao}`
    }));

    const statusOptions = statusList.map(status => ({
        value: status.PPS_Codigo || 0,
        label: status.PPS_Descricao || ''
    }));

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Header do Formulário */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Dados Gerais
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Informações básicas, datas e status do edital.
                        </p>
                    </div>
                    <Button type="submit" variant="primary" icon={Save}>
                        Salvar Alterações
                    </Button>
                </div>

                <div className="space-y-8 mt-6">
                    {/* Seção: Informações Básicas */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                            Informações Básicas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <Controller
                                name="PEP_Descricao"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        label="Título do Edital"
                                        type="text"
                                        {...field}
                                        placeholder="Digite o título completo do edital"
                                        error={errors.PEP_Descricao?.message}
                                        required
                                    />
                                )}
                            />
                            <Controller
                                name="PEP_Sigla"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        label="Sigla"
                                        type="text"
                                        {...field}
                                        placeholder="Ex: EDITAL 003/2025"
                                        error={errors.PEP_Sigla?.message}
                                        required
                                    />
                                )}
                            />
                            <Controller
                                name="PEP_Codigo_PRO"
                                control={control}
                                render={({ field }) => (
                                    <SelectField
                                        label="Tipo de Programa"
                                        options={programaOptions}
                                        value={field.value}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        placeholder="Selecione um programa"
                                        error={errors.PEP_Codigo_PRO?.message}
                                        required
                                    />
                                )}
                            />
                            <Controller
                                name="PEP_Codigo_PPS"
                                control={control}
                                render={({ field }) => (
                                    <SelectField
                                        label="Status"
                                        options={statusOptions}
                                        value={field.value}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        placeholder="Selecione um status"
                                        error={errors.PEP_Codigo_PPS?.message}
                                        required
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Seção: Datas */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                            Período de Vigência
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-600 dark:text-slate-300 mb-1">
                                    Data de Início
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <Controller
                                    name="PEP_DtInicio"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <DatePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.PEP_DtInicio?.message}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-600 dark:text-slate-300 mb-1">
                                    Data de Fim
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <Controller
                                    name="PEP_DtFim"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <DatePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.PEP_DtFim?.message}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seção: Anexos */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                            Anexos
                        </h2>
                        <div className="grid grid-cols-1 gap-y-6">
                            <div>
                                <Controller
                                    name="PEP_Edital"
                                    control={control}
                                    render={({ field }) => (
                                        <InputField
                                            label="Nome do Edital"
                                            type="text"
                                            placeholder="Ex: EDITAL PIBIC 2024"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            error={errors.PEP_Edital?.message}
                                            required
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-600 dark:text-slate-300 mb-1">
                                    Arquivo do Edital
                                    <span className="text-gray-400 text-xs ml-2">(Em breve)</span>
                                </label>
                                <input
                                    type="file"
                                    disabled
                                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-gray-200 file:text-gray-500
                                        file:cursor-not-allowed
                                        cursor-not-allowed
                                        opacity-60"
                                />
                                {/* TODO: Criar issue para implementar upload de arquivo do edital */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botão de Voltar */}
                <div className="mt-8 flex justify-start">
                    <Link to={`/editais/${periodo?.PEP_Codigo}/configurar`}>
                        <Button variant="link" icon={ChevronLeft} iconPosition="left">
                            Voltar para o Hub
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditalDadosGerais; 