import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Settings, FileText, Users, Award, ChevronRight, CheckCircle, Clock, AlertCircle, GraduationCap, ArrowLeft } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { useRelatorioConfig } from '../../../hooks/useRelatorioConfig';
import Button from "../../../components/ui/Button";

const ConfigurarRelatorio: React.FC = () => {
    const { id: editalId, relatorioId } = useParams<{ id: string; relatorioId: string }>();
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
            key: "conceitos",
            title: "Gerenciar Conceitos",
            description: "Configure os conceitos de avaliação do relatório.",
            icon: (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-lg text-blue-700 dark:text-blue-300"
                >
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" className="group-hover:animate-orbit-br" />
                    <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" className="group-hover:animate-orbit-tl" />
                    <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z" className="group-hover:animate-orbit-tr" />
                    <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" className="group-hover:animate-orbit-bl" />
                </svg>
            ),
            path: "conceitos",
            color: "from-blue-500/20 to-indigo-500/10",
            iconBg: "from-blue-400/30 to-transparent",
            iconColor: "text-blue-700 dark:text-blue-300",
            shadow: "shadow-blue-500/10",
            glow: "shadow-blue-500/30",
        },
        {
            key: "itens-avaliacao-bolsista",
            title: "Itens de Avaliação - Bolsista",
            description: "Configure os critérios de avaliação do bolsista.",
            icon: (
                <GraduationCap className="drop-shadow-lg w-6 h-6 group-hover:animate-sway text-emerald-700 dark:text-emerald-300" />
            ),
            path: "itens-avaliacao?tipo=bolsista",
            color: "from-emerald-500/20 to-green-500/10",
            iconBg: "from-emerald-400/30 to-transparent",
            iconColor: "text-emerald-700 dark:text-emerald-300",
            shadow: "shadow-emerald-500/10",
            glow: "shadow-emerald-500/30",
        },
        {
            key: "itens-avaliacao-orientador",
            title: "Itens de Avaliação - Orientador",
            description: "Configure os critérios de avaliação do orientador.",
            icon: (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-lg text-purple-700 dark:text-purple-300"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    <path
                        d="m16 11 2 2 4-4"
                        strokeDasharray="10"
                        strokeDashoffset="0"
                        className="group-hover:animate-redraw"
                    />
                </svg>
            ),
            path: "itens-avaliacao?tipo=orientador",
            color: "from-purple-500/20 to-violet-500/10",
            iconBg: "from-purple-400/30 to-transparent",
            iconColor: "text-purple-700 dark:text-purple-300",
            shadow: "shadow-purple-500/10",
            glow: "shadow-purple-500/30",
        },
        {
            key: "estrutura",
            title: "Estrutura do Relatório",
            description: "Defina a estrutura e organização do relatório.",
            icon: (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-lg text-amber-700 dark:text-amber-300"
                >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path
                        className="[stroke-dasharray:8] [stroke-dashoffset:0] group-hover:[stroke-dashoffset:8] group-hover:animate-draw-line-2"
                        d="M8 13h8"
                    />
                    <path
                        className="[stroke-dasharray:8] [stroke-dashoffset:0] group-hover:[stroke-dashoffset:8] group-hover:animate-draw-line-3"
                        d="M8 17h8"
                    />
                    <path
                        className="[stroke-dasharray:2] [stroke-dashoffset:0] group-hover:[stroke-dashoffset:2] group-hover:animate-draw-line-1"
                        d="M8 9h2"
                    />
                </svg>
            ),
            path: "estrutura",
            color: "from-amber-500/20 to-orange-500/10",
            iconBg: "from-amber-400/30 to-transparent",
            iconColor: "text-amber-700 dark:text-amber-300",
            shadow: "shadow-amber-500/10",
            glow: "shadow-amber-500/30",
        },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Concluído':
                return <CheckCircle className="text-green-400" />;
            case 'Pendente':
                return <AlertCircle className="text-yellow-400" />;
            default:
                return <Clock className="text-gray-500" />;
        }
    };

    // Determinar status de cada seção
    const sectionsWithStatus = sections.map(section => {
        let status = 'Pendente';
        
        if (section.key === 'conceitos') {
            status = conceitos.length > 0 ? 'Concluído' : 'Pendente';
        } else if (section.key === 'itens-avaliacao-bolsista') {
            status = itensBolsistaRelatorio.length > 0 ? 'Concluído' : 'Pendente';
        } else if (section.key === 'itens-avaliacao-orientador') {
            status = itensOrientadorRelatorio.length > 0 ? 'Concluído' : 'Pendente';
        } else if (section.key === 'estrutura') {
            status = estruturaRelatorio.length > 0 ? 'Concluído' : 'Pendente';
        }
        
        return { ...section, status };
    });

    if (loading) {
        return (
            <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-lg text-text-secondary">Carregando configuração do relatório...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Erro ao carregar relatório</h1>
                    <p className="text-text-secondary mb-4">{error}</p>
                    <Link to={`/editais/${editalId}/configurar/relatorios`}>
                        <button className="px-4 py-2 bg-ufba-blue text-white rounded-lg hover:bg-ufba-blue-dark transition-colors">
                            Voltar aos Relatórios
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 bg-gradient-to-br from-ufba-gray-50 to-ufba-gray-100 dark:from-ufba-gray-950 dark:to-ufba-gray-800 min-h-screen flex flex-col">
            <div className="flex-grow">
                <header className="mb-10">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 py-2">
                        Configuração do {relatorio?.descricao}
                    </h1>
                    <p className="text-lg text-text-secondary mt-2">
                        Configure os critérios e estrutura do relatório.
                    </p>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sectionsWithStatus.map((section, index) => (
                        <Link to={section.path} key={index} className="group block relative">
                            <Card className={`h-full flex flex-col justify-between transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-2xl dark:group-hover:shadow-cyan-500/20 overflow-hidden relative bg-gradient-to-br ${section.color} border border-white/20 backdrop-blur-lg`}>
                                <div className={`absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${section.color} blur-xl`}></div>
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-transparent to-black/10"></div>
                                
                                <Card.Content className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start justify-between">
                                        <div className="relative">
                                            <div className={`relative p-4 bg-gradient-to-br ${section.iconBg} backdrop-blur-sm rounded-2xl mb-4 shadow-lg`}>
                                                <div className="relative z-10">
                                                    {section.icon}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <span className="flex items-center text-xs font-semibold text-ufba-gray-700 dark:text-white/90 backdrop-blur-xl bg-black/5 dark:bg-black/10 px-2 py-1 rounded-full border border-black/10 dark:border-white/10">
                                            {getStatusIcon(section.status)}
                                            <span className="ml-1.5">{section.status}</span>
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-ufba-gray-900 dark:text-white drop-shadow-md">
                                            {section.title}
                                        </h3>
                                        <p className="text-ufba-gray-700 dark:text-white/80 mt-2 text-sm">
                                            {section.description}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-6 flex items-center justify-end text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline transition-colors duration-300">
                                        {section.status === 'Concluído' ? 'Alterar' : 'Configurar'}
                                        <ChevronRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </Card.Content>
                            </Card>
                        </Link>
                    ))}
                </main>
            </div>
            
            <footer className="mt-12 flex items-center">
                <Button onClick={() => navigate(`/editais/${editalId}/configurar/relatorios`)} variant="secondary">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
            </footer>
        </div>
    );
};

export default ConfigurarRelatorio; 