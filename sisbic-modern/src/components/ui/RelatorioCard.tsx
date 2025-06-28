import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import { AlertCircle } from 'lucide-react';
import { useRelatorioConfig } from '../../hooks/useRelatorioConfig';
import { Relatorio } from '../../types/relatorio';
import StatusBadge from './StatusBadge';

interface RelatorioCardProps {
    relatorio: Relatorio;
}

const RelatorioCard: React.FC<RelatorioCardProps> = ({ relatorio }) => {
    const { id, editalId } = useParams<{ id?: string; editalId?: string }>();
    const resolvedEditalId = editalId || id;
    
    const { 
        conceitos,
        itensBolsistaRelatorio,
        itensOrientadorRelatorio,
        estruturaRelatorio,
        loading,
        error 
    } = useRelatorioConfig(resolvedEditalId, relatorio.id.toString());

    // Calcula o progresso e status baseado nas configurações
    const calcularProgresso = () => {
        const totalConfiguracoes = 4; // Conceitos, Itens Bolsista, Itens Orientador, Estrutura
        let configuracoesCompletas = 0;

        if (conceitos?.length > 0) configuracoesCompletas++;
        if (itensBolsistaRelatorio?.length > 0) configuracoesCompletas++;
        if (itensOrientadorRelatorio?.length > 0) configuracoesCompletas++;
        if (estruturaRelatorio?.length > 0) configuracoesCompletas++;

        return {
            progresso: (configuracoesCompletas / totalConfiguracoes) * 100,
            configuracoesPendentes: totalConfiguracoes - configuracoesCompletas
        };
    };

    const { progresso, configuracoesPendentes } = calcularProgresso();
    const isCompleto = progresso === 100;

    if (loading) return null;
    if (error) return null;

    return (
        <Card className="group transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl dark:hover:shadow-cyan-500/20">
            <Card.Header>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-primary dark:text-primary-light">
                        {relatorio.descricao}
                    </h2>
                    <StatusBadge
                        status={isCompleto ? 'Completo' : `${configuracoesPendentes} ${configuracoesPendentes === 1 ? 'Configuração Pendente' : 'Configurações Pendentes'}`}
                        size="md"
                    />
                </div>
            </Card.Header>
            <Card.Content>
                {/* Barra de progresso linear */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progresso}%` }}
                    ></div>
                </div>
                <p className="text-sm text-neutral-500 dark:text-slate-400">
                    Gerencie as configurações e estrutura deste relatório.
                </p>
            </Card.Content>
            <Card.Footer>
                <Link 
                    to={`/editais/${resolvedEditalId}/relatorios/${relatorio.id}/configurar`}
                    className="w-full"
                >
                    <Button
                        variant="primary"
                        className="w-full"
                    >
                        Gerenciar &gt;
                    </Button>
                </Link>
            </Card.Footer>
        </Card>
    );
};

export default RelatorioCard; 