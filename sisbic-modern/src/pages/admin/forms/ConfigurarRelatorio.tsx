import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Settings, FileText, Users, Award, ChevronRight, CheckCircle, Clock, AlertCircle, GraduationCap, ArrowLeft } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { useRelatorioConfig } from '../../../hooks/useRelatorioConfig';
import Button from "../../../components/ui/Button";
import StatusBadge from '../../../components/ui/StatusBadge';

const ConfigurarRelatorio: React.FC = () => {
    const { editalId, relatorioId } = useParams<{ editalId: string; relatorioId: string }>();
    const navigate = useNavigate();
    const { 
        relatorio, 
        conceitos, 
        itensOrientadorRelatorio,
        itensBolsistaRelatorio,
        estruturaRelatorio,
        loading, 
        error 
    } = useRelatorioConfig(editalId, relatorioId);

    // Estrutura das seções de configuração
    const sections = [
        {
            key: "estrutura",
            title: "Estrutura do Relatório",
            description: "Configure as seções e campos que compõem o relatório.",
            path: `estrutura`,
            icon: FileText,
        },
        {
            key: "conceitos",
            title: "Gerenciar Conceitos",
            description: "Configure os conceitos de avaliação do relatório.",
            path: `conceitos`,
            icon: Award,
        },
        {
            key: "itens-avaliacao-orientador",
            title: "Avaliação do Orientador",
            description: "Configure os itens de avaliação para o orientador.",
            path: `itens-avaliacao?tipo=orientador`,
            icon: GraduationCap,
        },
        {
            key: "itens-avaliacao-bolsista",
            title: "Avaliação do Bolsista",
            description: "Configure os itens de avaliação para o bolsista.",
            path: `itens-avaliacao?tipo=bolsista`,
            icon: Users,
        }
    ];

    // Determinar status de cada seção
    const sectionsWithStatus = sections.map(section => {
        let status = 'Pendente';
        let progress = 0;
        
        if (section.key === 'conceitos') {
            status = conceitos.length > 0 ? 'Concluído' : 'Pendente';
            progress = conceitos.length > 0 ? 100 : 0;
        } else if (section.key === 'itens-avaliacao-bolsista') {
            status = itensBolsistaRelatorio.length > 0 ? 'Concluído' : 'Pendente';
            progress = itensBolsistaRelatorio.length > 0 ? 100 : 0;
        } else if (section.key === 'itens-avaliacao-orientador') {
            status = itensOrientadorRelatorio.length > 0 ? 'Concluído' : 'Pendente';
            progress = itensOrientadorRelatorio.length > 0 ? 100 : 0;
        } else if (section.key === 'estrutura') {
            status = estruturaRelatorio.length > 0 ? 'Concluído' : 'Pendente';
            progress = estruturaRelatorio.length > 0 ? 100 : 0;
        }
        
        return { ...section, status, progress };
    });

    // Encontrar o primeiro card pendente para destacar
    const firstPendingSection = sectionsWithStatus.find(section => section.status === 'Pendente');

    if (loading) {
        return (
            <div className="p-4 md:p-8 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Configuração do {relatorio?.descricao}
                    </h1>
                    <p className="text-md text-gray-500 dark:text-gray-400 mt-1">
                        Configure os critérios e estrutura do relatório.
                    </p>
                </div>

                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Carregando configuração do relatório...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 md:p-8 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Configuração do {relatorio?.descricao}
                    </h1>
                    <p className="text-md text-gray-500 dark:text-gray-400 mt-1">
                        Configure os critérios e estrutura do relatório.
                    </p>
                </div>

                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="text-red-500 mr-2" size={20} />
                    <span className="text-red-700">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Cabeçalho */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Configuração do {relatorio?.descricao}
                </h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">
                    Configure os critérios e estrutura do relatório.
                </p>
            </div>

            {/* Grid de Configurações */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectionsWithStatus.map((section, index) => (
                    <Link 
                        to={`/editais/${editalId}/relatorios/${relatorioId}/${section.path}`}
                        key={section.key}
                        className="block"
                    >
                        <Card 
                            className={`h-full transition-all duration-300 hover:scale-[1.02] ${
                                firstPendingSection?.key === section.key 
                                ? 'border-2 border-primary dark:border-primary-light' 
                                : ''
                            }`}
                        >
                            <Card.Header>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <section.icon className="h-5 w-5 text-primary dark:text-primary-light" />
                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                            {section.title}
                                        </h2>
                                    </div>
                                    <StatusBadge status={section.status} />
                                </div>
                            </Card.Header>
                            <Card.Content>
                                {/* Barra de progresso linear */}
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                                    <div
                                        className="bg-primary dark:bg-primary-light h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${section.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {section.description}
                                </p>
                            </Card.Content>
                            <Card.Footer>
                                <Button
                                    variant="link"
                                    className="w-full justify-between"
                                >
                                    Gerenciar
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Botão Voltar */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link to={`/editais/${editalId}/configurar/relatorios`}>
                    <Button 
                        variant="secondary"
                        icon={ArrowLeft}
                        iconPosition="left"
                    >
                        Voltar para Relatórios
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default ConfigurarRelatorio; 