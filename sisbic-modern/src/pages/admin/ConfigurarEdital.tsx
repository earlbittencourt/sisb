import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    BookOpen, 
    Building2, 
    Settings, 
    FileText, 
    Users, 
    BarChart3,
    Calendar,
    ChevronLeft
} from 'lucide-react';
import { useEdital } from '../../contexts/EditalContext';
import { useAvaliacao } from '../../hooks/useAvaliacao';
import ConfigurationStepCard from '../../components/ui/ConfigurationStepCard';
import Button from '../../components/ui/Button';

const initialSections = [
  {
    key: "dados-gerais",
    title: "Dados Gerais",
    description: "Defina o nome, sigla, programa e status do edital.",
    icon: <BookOpen size={24} />,
    path: "dados-gerais",
  },
  {
    key: "agencias-fomento",
    title: "Agências de Fomento",
    description: "Configure as agências financiadoras e suas cotas de bolsas.",
    icon: <Building2 size={24} />,
    path: "agencias-fomento",
  },
  {
    key: "configurar-submissao",
    title: "Configurar Submissão",
    description: "Estabeleça os parâmetros para submissão de projetos.",
    icon: <Settings size={24} />,
    path: "configurar-submissao",
  },
  {
    key: "avaliacao-projetos",
    title: "Avaliação de Projetos",
    description: "Configure os critérios de avaliação dos projetos submetidos.",
    icon: <FileText size={24} />,
    path: "avaliacao-projetos",
  },
  {
    key: "avaliacao-curriculo",
    title: "Avaliação de Currículo",
    description: "Configure os itens de avaliação do currículo dos candidatos.",
    icon: <Users size={24} />,
    path: "avaliacao-curriculo",
  },
  {
    key: "calendario",
    title: "Calendário",
    description: "Estabeleça as datas importantes e os prazos do edital.",
    icon: <Calendar size={24} />,
    path: "calendario",
  },
  {
    key: "relatorios",
    title: "Relatórios",
    description: "Crie e configure os modelos de relatórios parciais e finais.",
    icon: <BarChart3 size={24} />,
    path: "relatorios",
  },
];

const ConfigurarEdital: React.FC<{ isNovo?: boolean }> = ({ isNovo = false }) => {
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
        if (id && !isNovo) {
            fetchCriteriosProjeto(id);
            fetchItensAvaliacao(id);
        }
    }, [id, fetchCriteriosProjeto, fetchItensAvaliacao, isNovo]);

    const sections = initialSections.map(section => {
        let status: 'Concluído' | 'Pendente' = 'Pendente';
        if (!isNovo) {
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
        }
        return { ...section, status };
    });

    // Encontrar o primeiro card pendente para destacar
    const firstPendingIndex = sections.findIndex(section => section.status === 'Pendente');

    const loading = editalLoading || avaliacaoLoading;

    if (loading) {
         return (
            <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-lg text-text-secondary">Carregando configuração do edital...</p>
            </div>
        );
    }

    const completedSections = sections.filter(s => s.status === 'Concluído').length;
    const totalSections = sections.length;
    const progressPercentage = (completedSections / totalSections) * 100;

    return (
        <div className="p-6 bg-gradient-to-br from-ufba-gray-50 to-ufba-gray-100 dark:from-ufba-gray-950 dark:to-ufba-gray-800 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {isNovo ? 'Novo Edital' : `Configuração do Edital: ${periodo?.PEP_Sigla}`}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Siga os passos abaixo para configurar completamente o seu edital.
                </p>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary dark:text-white">
                        Progresso Geral
                    </span>
                    <span className="text-sm font-medium text-neutral-600 dark:text-slate-300">
                        {completedSections} de {totalSections} seções concluídas
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                        className="bg-primary dark:bg-primary-light h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-text-secondary dark:text-gray-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sections.map((section, index) => (
                    <ConfigurationStepCard
                        key={section.key}
                        title={section.title}
                        description={section.description}
                        status={section.status}
                        path={section.path}
                        icon={section.icon}
                        isHighlighted={index === firstPendingIndex}
                    />
                ))}
            </div>

            {/* Botão de Voltar */}
            <div className="mt-12 flex justify-start">
                <Link to="/editais">
                    <Button variant="secondary" icon={ChevronLeft} iconPosition="left">
                        Voltar para Editais
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default ConfigurarEdital; 