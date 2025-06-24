import React, { useEffect, useState } from 'react';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Type, ChevronsUpDown, Hash, UploadCloud, Save, X, FileText, ChevronLeft } from 'lucide-react';

import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Select from '../../../components/ui/Select';
import { DatePicker } from '../../../components/ui/DatePicker';
import { useProgramas } from '../../../hooks/useProgramas';
import { useStatus } from '../../../hooks/useStatus';
import { useSpotlight } from '../../../hooks/useSpotlight';
import { useEdital } from '../../../contexts/EditalContext';

// Zod Schema for validation
const formSchema = z.object({
    PEP_Descricao: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres."),
    PEP_Sigla: z.string().min(3, "A sigla deve ter pelo menos 3 caracteres."),
    PEP_Codigo_PRO: z.number().int().positive("Selecione um programa."),
    PEP_Codigo_PPS: z.number().int().positive("Selecione um status."),
    PEP_DtInicio: z.string().nonempty("A data de início é obrigatória."),
    PEP_DtFim: z.string().nonempty("A data de fim é obrigatória."),
    PEP_ArquivoEdital: z.string().optional(),
    PEP_NomeArquivo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const EditalDadosGerais: React.FC = () => {
    const navigate = useNavigate();
    const { periodo, loading: editalLoading } = useEdital();
    const { programas, buscarProgramas, loading: programasLoading } = useProgramas();
    const { status: statusList, buscarStatus, loading: statusLoading } = useStatus();
    const formContainerRef = useSpotlight<HTMLDivElement>();
    const [fileName, setFileName] = useState<string | null>(null);

    const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        // Busca os dados para os selects
        buscarProgramas();
        buscarStatus();
    }, [buscarProgramas, buscarStatus]);
    
    useEffect(() => {
        // Popula o formulário quando os dados do edital (do contexto) estiverem disponíveis
        if (periodo) {
            reset({
                ...periodo,
                PEP_DtInicio: periodo.PEP_DtInicio ? periodo.PEP_DtInicio.split('T')[0] : '',
                PEP_DtFim: periodo.PEP_DtFim ? periodo.PEP_DtFim.split('T')[0] : '',
            });
            if (periodo.PEP_NomeArquivo) {
                setFileName(periodo.PEP_NomeArquivo);
            }
        }
    }, [periodo, reset]);

    const onSubmit = async (data: FormData) => {
        console.log(data);
        // Lógica de salvamento virá aqui
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setValue("PEP_NomeArquivo", file.name);
        } else {
            setFileName(null);
            setValue("PEP_NomeArquivo", "");
        }
    };

    interface InputFieldProps {
        icon: React.ReactNode;
        label: string;
        children: React.ReactNode;
        error?: FieldError;
    }

    const InputField: React.FC<InputFieldProps> = ({ icon, label, children, error }) => (
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center">
                {icon}
                <span className="ml-2">{label}</span>
            </label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
    
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

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Dados Gerais
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Informações básicas, datas e status do edital.
                        </p>
                    </div>
                    <Button type="submit" variant="primary">
                        <Save size={18} className="mr-2" />
                        Salvar Alterações
                    </Button>
                </div>

                <div className="space-y-8 mt-6">
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Informações Básicas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                             <InputField label="Título do Edital" icon={<BookOpen size={16} />} error={errors.PEP_Descricao}>
                                <input type="text" {...register("PEP_Descricao")} className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" />
                            </InputField>
                            <InputField label="Sigla" icon={<Hash size={16} />} error={errors.PEP_Sigla}>
                                <input type="text" {...register("PEP_Sigla")} className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" />
                            </InputField>
                            <InputField label="Tipo de Programa" icon={<Type size={16} />} error={errors.PEP_Codigo_PRO}>
                                <Controller
                                    name="PEP_Codigo_PRO"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Selecione um programa..."
                                            options={programas.map(p => ({ value: p.PRO_Codigo, label: p.PRO_Descricao }))}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </InputField>
                             <InputField label="Status" icon={<ChevronsUpDown size={16} />} error={errors.PEP_Codigo_PPS}>
                                <Controller
                                    name="PEP_Codigo_PPS"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Selecione um status..."
                                            options={statusList.map(s => ({ value: s.PPS_Codigo, label: s.PPS_Descricao }))}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </InputField>
                            <InputField label="Data de Início" icon={<Calendar size={16} />} error={errors.PEP_DtInicio}>
                                <Controller
                                    name="PEP_DtInicio"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value ? new Date(field.value) : undefined}
                                            onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                                        />
                                    )}
                                />
                            </InputField>
                             <InputField label="Data de Fim" icon={<Calendar size={16} />} error={errors.PEP_DtFim}>
                                <Controller
                                    name="PEP_DtFim"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value ? new Date(field.value) : undefined}
                                            onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                                        />
                                    )}
                                />
                            </InputField>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                         <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center mb-6">
                            <UploadCloud size={20} className="mr-3" />
                            Arquivo do Edital (.PDF)
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 items-end">
                            <InputField label="Nome do Arquivo" icon={<FileText size={16} />} error={errors.PEP_NomeArquivo}>
                                <input 
                                    type="text" 
                                    {...register("PEP_NomeArquivo")}
                                    placeholder="Ex: EDITAL PRPPG/UFBA 003/2025" 
                                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" 
                                />
                            </InputField>
                            <div className="flex items-center gap-x-4">
                               <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 px-6 py-3 text-base btn-primary"
                                >
                                    <UploadCloud size={16} className="mr-2" />
                                    Escolher Arquivo
                                </label>
                                {fileName && <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{fileName}</span>}
                            </div>
                         </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-start">
                    <Link to={`/editais/${periodo?.PEP_Codigo}/configurar`}>
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

export default EditalDadosGerais; 