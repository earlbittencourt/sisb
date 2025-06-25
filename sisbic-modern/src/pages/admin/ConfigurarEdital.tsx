import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileText, DollarSign, Settings, ClipboardCheck, UserCheck, Calendar, BarChart2, ChevronRight, CheckCircle, Clock, AlertCircle, FileKey, BarChart3 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useEdital } from '../../contexts/EditalContext';
import { useAvaliacao } from '../../hooks/useAvaliacao';

const getHoverAnimation = (key: string) => {
    if (key === 'configurar-submissao') {
        return 'group-hover:animate-spin-physics';
    }
    if (key === 'avaliacao-curriculo' || key === 'dados-gerais' || key === 'avaliacao-projetos' || key === 'relatorios' || key === 'calendario') {
        return '';
    }
    return 'group-hover:animate-flip-3d';
};

// Estrutura base das seções (sem status)
const initialSections = [
  {
    key: "dados-gerais",
    title: "Dados Gerais",
    description: "Defina o nome, sigla, datas e status do edital.",
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
    path: "dados-gerais",
    color: "from-blue-500/20 to-indigo-500/10",
    iconBg: "from-blue-400/30 to-transparent",
    iconColor: "text-blue-700 dark:text-blue-300",
    shadow: "shadow-blue-500/10",
    glow: "shadow-blue-500/30",
  },
  {
    key: "agencias-fomento",
    title: "Agências de Fomento",
    description: "Adicione as agências e defina as cotas de bolsas.",
    icon: <DollarSign size={24} className="drop-shadow-lg text-emerald-700 dark:text-emerald-300" />,
    path: "agencias-fomento",
    color: "from-emerald-500/20 to-green-500/10",
    iconBg: "from-emerald-400/30 to-transparent",
    iconColor: "text-emerald-700 dark:text-emerald-300",
    shadow: "shadow-emerald-500/10",
    glow: "shadow-emerald-500/30",
  },
  {
    key: "configurar-submissao",
    title: "Configurar Submissão",
    description: "Defina os critérios e campos para a submissão de projetos.",
    icon: <Settings size={24} className="drop-shadow-lg text-purple-700 dark:text-purple-300" />,
    path: "configuracao-submissao",
    color: "from-purple-500/20 to-violet-500/10",
    iconBg: "from-purple-400/30 to-transparent",
    iconColor: "text-purple-700 dark:text-purple-300",
    shadow: "shadow-purple-500/10",
    glow: "shadow-purple-500/30",
  },
  {
    key: "avaliacao-projetos",
    title: "Avaliação de Projetos",
    description: "Configure os pesos dos critérios de avaliação dos projetos.",
    icon: (
        <svg 
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
            className="drop-shadow-lg text-amber-700 dark:text-amber-300"
        >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M15 2H9a2 2 0 0 0-2 2v2" />
            <path 
                d="m9 14 2 2 4-4" 
                className="[stroke-dasharray:9] [stroke-dashoffset:0] group-hover:animate-redraw group-hover:[animation-delay:250ms]"
            />
        </svg>
    ),
    path: "avaliacao-projetos",
    color: "from-amber-500/20 to-orange-500/10",
    iconBg: "from-amber-400/30 to-transparent",
    iconColor: "text-amber-700 dark:text-amber-300",
    shadow: "shadow-amber-500/10",
    glow: "shadow-amber-500/30",
  },
  {
    key: "avaliacao-curriculo",
    title: "Avaliação de Currículo",
    description: "Configure os pesos e tetos para avaliação de currículo Lattes.",
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
            className="drop-shadow-lg text-cyan-700 dark:text-cyan-300"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path
                className="[stroke-dasharray:24] [stroke-dashoffset:0] group-hover:[stroke-dashoffset:24] group-hover:animate-draw-check group-hover:[animation-delay:250ms]"
                d="M16 11l2 2 4-4"
            />
        </svg>
    ),
    path: "avaliacao-curriculo",
    color: "from-cyan-500/20 to-blue-500/10",
    iconBg: "from-cyan-400/30 to-transparent",
    iconColor: "text-cyan-700 dark:text-cyan-300",
    shadow: "shadow-cyan-500/10",
    glow: "shadow-cyan-500/30",
  },
  {
    key: "calendario",
    title: "Calendário",
    description: "Estabeleça as datas importantes e os prazos do edital.",
    icon: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-lg text-rose-700 dark:text-rose-300"
        >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            {/* Número 2 */}
            <path
                className="[stroke-dasharray:16] [stroke-dashoffset:0] group-hover:animate-redraw-29-2"
                d="M7.5,15 a2 2 0 0 1 4 0 l-4,4 h4"
            />
            {/* Número 9 - Círculo animado */}
            <path
                className="[stroke-dasharray:13] [stroke-dashoffset:0] group-hover:animate-redraw-29-9 group-hover:[animation-delay:150ms]"
                d="M16.5,15.5 a2 2 0 1 1-4,0 a2 2 0 0 1 4,0"
            />
            {/* Número 9 - Cauda estática */}
            <path d="M16.5 15.5V19" />
        </svg>
    ),
    path: "calendario",
    color: "from-rose-500/20 to-pink-500/10",
    iconBg: "from-rose-400/30 to-transparent",
    iconColor: "text-rose-700 dark:text-rose-300",
    shadow: "shadow-rose-500/10",
    glow: "shadow-rose-500/30",
  },
  {
    key: "relatorios",
    title: "Relatórios",
    description: "Crie e configure os modelos de relatórios parciais e finais.",
    icon: <BarChart3 size={24} className="drop-shadow-lg group-hover:animate-bars-bounce text-cyan-700 dark:text-cyan-300" />,
    path: "relatorios",
    color: "from-cyan-500/20 to-sky-500/10",
    iconBg: "from-cyan-400/30 to-transparent",
    iconColor: "text-cyan-700 dark:text-cyan-300",
    shadow: "shadow-cyan-500/10",
    glow: "shadow-cyan-500/30",
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

const ConfigurarEdital: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { periodo, agenciasDoEdital, submissaoConfig, loading: editalLoading } = useEdital();
    const { 
        criteriosProjeto, 
        itensAvaliacao, 
        fetchCriteriosProjeto, 
        fetchItensAvaliacao, 
        loading: avaliacaoLoading 
    } = useAvaliacao();

    useEffect(() => {
        if (id) {
            fetchCriteriosProjeto(id);
            fetchItensAvaliacao(id);
        }
    }, [id, fetchCriteriosProjeto, fetchItensAvaliacao]);

    const sections = initialSections.map(section => {
        let status = 'Pendente';
        if (section.key === 'dados-gerais') {
            const isCompleted = periodo && periodo.PEP_Descricao && periodo.PEP_Sigla && periodo.PEP_DtInicio && periodo.PEP_DtFim;
            status = isCompleted ? 'Concluído' : 'Pendente';
        }
        if (section.key === 'agencias-fomento') {
            status = agenciasDoEdital.length > 0 ? 'Concluído' : 'Pendente';
        }
        if (section.key === 'configurar-submissao') {
            const isCompleted = submissaoConfig &&
                submissaoConfig.PCF_nmProjetos != null &&
                submissaoConfig.PCF_nmMinPlanos != null &&
                submissaoConfig.PCF_nmPlanos != null &&
                submissaoConfig.PCF_nmAvaliadores != null;
            status = isCompleted ? 'Concluído' : 'Pendente';
        }
        if (section.key === 'avaliacao-projetos') {
            status = criteriosProjeto.length > 0 ? 'Concluído' : 'Pendente';
        }
        if (section.key === 'avaliacao-curriculo') {
            status = itensAvaliacao.length > 0 ? 'Concluído' : 'Pendente';
        }
        return { ...section, status };
    });

    const loading = editalLoading || avaliacaoLoading;

    if (loading) {
         return (
            <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-lg text-text-secondary">Carregando configuração do edital...</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 bg-gradient-to-br from-ufba-gray-50 to-ufba-gray-100 dark:from-ufba-gray-950 dark:to-ufba-gray-800 min-h-screen">
            <header className="mb-10">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 py-2">
                    Configuração do Edital: {periodo?.PEP_Sigla}
                </h1>
                <p className="text-lg text-text-secondary mt-2">
                    Siga os passos abaixo para configurar completamente o seu edital.
                </p>
            </header>

            {/* Barra de Progresso */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary dark:text-white">
                        Progresso Geral
                    </span>
                    <span className="text-sm font-medium text-text-secondary dark:text-gray-300">
                        {sections.filter(s => s.status === 'Concluído').length} de {sections.length} seções concluídas
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                            width: `${(sections.filter(s => s.status === 'Concluído').length / sections.length) * 100}%` 
                        }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-text-secondary dark:text-gray-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sections.map((section, index) => (
                    <Link to={section.path} key={index} className="group block relative">
                        <Card className={`h-full flex flex-col justify-between transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-2xl dark:group-hover:shadow-cyan-500/20 overflow-hidden relative bg-gradient-to-br ${section.color} border border-white/20 backdrop-blur-lg`}>
                            <div className={`absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${section.color} blur-xl`}></div>
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-transparent to-black/10"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between">
                                    <div className="relative">
                                        <div className={`relative p-4 bg-gradient-to-br ${section.iconBg} backdrop-blur-sm rounded-2xl mb-4 shadow-lg ${getHoverAnimation(section.key)} ${section.iconColor}`}>
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
                                
                                <div className="mt-6 flex items-center justify-end text-sm font-semibold text-ufba-gray-600 dark:text-white/70 group-hover:text-ufba-gray-900 dark:group-hover:text-white transition-colors duration-300">
                                    {section.status === 'Concluído' ? 'Alterar' : 'Configurar'}
                                    <ChevronRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
            <div className="mt-12 flex justify-end">
                <Button variant="primary">Publicar Edital</Button>
            </div>
        </div>
    );
};

export default ConfigurarEdital; 