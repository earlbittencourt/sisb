import React from 'react';
import { useParams } from 'react-router-dom';
import { useRelatorioConfig } from '../../../../hooks/useRelatorioConfig';
import GerenciarConceitos from '../components/GerenciarConceitos';
import ConfigLayout from '../../../../layouts/ConfigLayout';

const GerenciarConceitosPage: React.FC = () => {
    const { id: editalId, relatorioId } = useParams<{ id: string; relatorioId: string }>();

    const {
        relatorio,
        conceitos,
        loading,
        error,
        addConceito,
        updateConceito,
        deleteConceito,
    } = useRelatorioConfig(editalId, relatorioId);

    if (loading) {
        return <div className="p-6">Carregando...</div>;
    }

    if (error) {
        return <div className="p-6">Erro: {error}</div>;
    }

    if (!relatorio) {
        return <div className="p-6">Relatório não encontrado.</div>;
    }
    
    if (!editalId || !relatorioId) {
        // This case should ideally be handled by the router, but as a fallback:
        return (
            <div className="p-6 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Erro: Parâmetros inválidos</h1>
                        <p className="text-text-secondary dark:text-text-secondary-dark">
                            ID do edital ou relatório não encontrado na URL.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ConfigLayout
            linkVoltar={`/editais/${editalId}/relatorios/${relatorioId}/configurar`}
        >
            {relatorio && (
                <GerenciarConceitos
                    titulo="Gerenciar Conceitos"
                    descricao={`Configure os conceitos de avaliação para o relatório "${relatorio.descricao}".`}
                    conceitos={conceitos}
                    onAdd={addConceito}
                    onUpdate={updateConceito}
                    onDelete={deleteConceito}
                />
            )}
        </ConfigLayout>
    );
};

export default GerenciarConceitosPage; 