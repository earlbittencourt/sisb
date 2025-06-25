import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from './Card';
import ProgressCircle from './ProgressCircle';
import Button from './Button';
import { Settings, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useRelatorioConfig } from '../../hooks/useRelatorioConfig';
import { Relatorio } from '../../types/relatorio';

interface RelatorioCardProps {
    relatorio: Relatorio;
    onDelete: (id: number) => void;
}

const RelatorioCard: React.FC<RelatorioCardProps> = ({ relatorio, onDelete }) => {
    const { id: editalId } = useParams<{ id: string }>();
    const {
        conceitos,
        itensBolsistaRelatorio,
        itensOrientadorRelatorio,
        estruturaRelatorio,
        loading,
        error
    } = useRelatorioConfig(editalId, relatorio.id.toString());

    const sections = [
        { key: "conceitos", completed: conceitos.length > 0, label: "Conceitos" },
        { key: "itens-bolsista", completed: itensBolsistaRelatorio.length > 0, label: "Itens do Bolsista" },
        { key: "itens-orientador", completed: itensOrientadorRelatorio.length > 0, label: "Itens do Orientador" },
        { key: "estrutura", completed: estruturaRelatorio.length > 0, label: "Estrutura do Relatório" },
    ];

    const total = sections.length;
    const concluidas = sections.filter(s => s.completed).length;
    const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    const pendencias = sections.filter(s => !s.completed).map(s => s.label);
    
    let status: 'Concluído' | 'Pendente' | 'Vazio' = 'Pendente';
    if (progresso === 100) {
        status = 'Concluído';
    } else if (progresso === 0 && concluidas === 0 && !loading) {
        status = 'Vazio';
    }

    const getStatusIcon = (status: 'Concluído' | 'Pendente' | 'Vazio') => {
        switch (status) {
            case 'Concluído':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'Pendente':
                return <Clock className="h-4 w-4 text-amber-500" />;
            case 'Vazio':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    if (error) {
         return (
            <Card className="flex flex-col justify-center items-center h-full min-h-[260px] bg-red-50 dark:bg-red-500/10">
                <AlertCircle className="text-red-500 mb-2" />
                <p className="text-sm text-red-600 dark:text-red-300 text-center font-semibold">Erro ao carregar dados:</p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 text-center">{relatorio.descricao}</p>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 min-h-[260px]">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">{relatorio.descricao}</h3>
                        {loading ? (
                            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-24 rounded mt-1.5" />
                        ) : (
                            <div className="flex items-center text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
                                {getStatusIcon(status)}
                                <span className="ml-1.5">{status}</span>
                            </div>
                        )}
                    </div>
                    <ProgressCircle progress={progresso} />
                </div>

                <div className="mb-4 min-h-[90px]">
                    {loading ? (
                        <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/5 mb-3"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {pendencias.length > 0 && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
                                    <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Configurações Pendentes:</h4>
                                    <ul className="space-y-1">
                                        {pendencias.map(pendencia => (
                                            <li key={pendencia} className="flex items-center text-xs text-yellow-700 dark:text-yellow-300">
                                                <AlertCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                                                {pendencia}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {status === 'Concluído' && (
                                <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-lg text-center flex flex-col justify-center items-center h-full">
                                     <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                                        Todas as configurações foram concluídas!
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                <Link to={`/editais/${editalId}/relatorios/${relatorio.id}/configurar`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurar
                    </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => onDelete(relatorio.id)} className="flex-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                </Button>
            </div>
        </Card>
    );
};

export default RelatorioCard; 