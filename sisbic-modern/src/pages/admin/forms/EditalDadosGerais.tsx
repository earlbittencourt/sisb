import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft } from 'lucide-react';

import Button from '../../../components/ui/Button';
import InputField from '../../../components/ui/InputField';
import SelectField from '../../../components/ui/SelectField';
import FileUploadField from '../../../components/ui/FileUploadField';
import { useProgramas } from '../../../hooks/useProgramas';
import { useStatus } from '../../../hooks/useStatus';
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
                PEP_Sigla: periodo.PEP_Sigla,
                PEP_Descricao: periodo.PEP_Descricao,
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

    const handleFileSelect = (file: File | null) => {
        if (file) {
            setFileName(file.name);
            setValue("PEP_NomeArquivo", file.name);
        }
    };

    const handleFileNameChange = (fileName: string) => {
        setFileName(fileName);
        setValue("PEP_NomeArquivo", fileName);
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
                            <InputField
                                label="Título do Edital"
                                type="text"
                                {...register("PEP_Descricao")}
                                placeholder="Digite o título completo do edital"
                                error={errors.PEP_Descricao?.message}
                                required
                            />
                            
                            <InputField
                                label="Sigla"
                                type="text"
                                {...register("PEP_Sigla")}
                                placeholder="Ex: EDITAL 003/2025"
                                error={errors.PEP_Sigla?.message}
                                required
                            />
                            
                            <Controller
                                name="PEP_Codigo_PRO"
                                control={control}
                                render={({ field }) => (
                                    <SelectField
                                        label="Tipo de Programa"
                                        options={programaOptions}
                                        value={field.value}
                                        onChange={field.onChange}
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
                                        onChange={field.onChange}
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
                            <InputField
                                label="Data de Início"
                                type="date"
                                {...register("PEP_DtInicio")}
                                error={errors.PEP_DtInicio?.message}
                                required
                            />
                            
                            <InputField
                                label="Data de Fim"
                                type="date"
                                {...register("PEP_DtFim")}
                                error={errors.PEP_DtFim?.message}
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Seção: Arquivo do Edital */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                            Arquivo do Edital (.PDF)
                        </h2>
                        <FileUploadField
                            label="Arquivo do Edital"
                            fileName={fileName || ''}
                            onFileNameChange={handleFileNameChange}
                            onFileSelect={handleFileSelect}
                            accept=".pdf"
                            buttonLabel="Escolher Arquivo"
                        />
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