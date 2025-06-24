import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import ConfigLayout from '../../../../layouts/ConfigLayout';
import GerenciarItensAvaliacao from '../components/GerenciarItensAvaliacao';
import { useRelatorioConfig } from '../../../../hooks/useRelatorioConfig';
import Button from '../../../../components/ui/Button';
import { ChevronLeft } from 'lucide-react';

const GerenciarItensAvaliacaoPage: React.FC = () => {
    const { id: editalId, relatorioId } = useParams<{ id: string; relatorioId: string }>();
    const [searchParams] = useSearchParams();
    const tipo = searchParams.get('tipo') || 'orientador'; // 'orientador' ou 'bolsista'

    // O hook deve ser chamado sempre, nunca condicionalmente!
    const {
        itensOrientadorMaster,
        itensOrientadorRelatorio,
        itensBolsistaMaster,
        itensBolsistaRelatorio,
        addItemOrientador,
        updateItemOrientador,
        removeItemOrientador,
        addItemBolsista,
        updateItemBolsista,
        removeItemBolsista,
        loading,
        error
    } = useRelatorioConfig(editalId, relatorioId);

    // Só depois do hook, faça o return condicional
    if (!editalId || !relatorioId) {
        // eslint-disable-next-line no-console
        console.error('Parâmetros inválidos:', { editalId, relatorioId });
        return (
            <div className="p-6 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Erro: Parâmetros inválidos</h1>
                        <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
                            ID do edital ou relatório não encontrado na URL.
                        </p>
                        <Link to="/editais">
                            <Button variant="secondary">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Voltar para Editais
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    const isOrientador = tipo === 'orientador';
    const masterList = isOrientador ? itensOrientadorMaster : itensBolsistaMaster;
    const selectedList = isOrientador ? itensOrientadorRelatorio : itensBolsistaRelatorio;
    const onAdd = isOrientador ? addItemOrientador : addItemBolsista;
    const onUpdate = isOrientador ? updateItemOrientador : updateItemBolsista;
    const onRemove = isOrientador ? removeItemOrientador : removeItemBolsista;
    
    const titulo = isOrientador ? 'Itens de Avaliação - Orientador' : 'Itens de Avaliação - Bolsista';
    const descricao = isOrientador 
        ? 'Configure os critérios de avaliação do orientador para este relatório.'
        : 'Configure os critérios de avaliação do bolsista para este relatório.';

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-text-secondary">Carregando itens de avaliação...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-red-500 mb-2">Erro ao carregar dados</h3>
                        <p className="text-text-secondary">{error}</p>
                    </div>
                </div>
            );
        }

        return (
            <GerenciarItensAvaliacao
                titulo={titulo}
                descricao={descricao}
                masterList={masterList}
                selectedList={selectedList}
                onAdd={onAdd}
                onUpdate={onUpdate}
                onRemove={onRemove}
                loading={loading}
            />
        );
    };

    return (
        <ConfigLayout
            linkVoltar={`/editais/${editalId}/relatorios/${relatorioId}/configurar`}
        >
            {renderContent()}
        </ConfigLayout>
    );
};

export default GerenciarItensAvaliacaoPage; 