import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRelatorioConfig } from '../../../../hooks/useRelatorioConfig';
import GerenciarEstruturaRelatorio from '../components/GerenciarEstruturaRelatorio';
import Button from '../../../../components/ui/Button';
import { ChevronLeft } from 'lucide-react';

const GerenciarEstruturaPage: React.FC = () => {
    const { editalId, relatorioId } = useParams<{ editalId: string; relatorioId: string }>();

    const {
        relatorio,
        loading,
        error,
        categoriasMaster,
        itensEstruturaMaster,
        criteriosMaster,
        estruturaRelatorio,
        salvarEstruturaRelatorio,
    } = useRelatorioConfig(editalId, relatorioId);

    if (loading) {
        return <div className="p-6">Carregando...</div>;
    }

    if (error) {
        return <div className="p-6">Erro: {error}</div>;
    }
    
    if (!editalId || !relatorioId) {
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

    return (
        <div className="p-6 bg-background-light dark:bg-background-dark min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="py-6">
                    {relatorio && (
                        <GerenciarEstruturaRelatorio
                            titulo="Gerenciar Estrutura do Relatório"
                            descricao={`Organize as seções e os itens que compõem o relatório "${relatorio.descricao}".`}
                            categorias={estruturaRelatorio}
                            categoriasMaster={categoriasMaster}
                            itensMaster={itensEstruturaMaster}
                            criteriosMaster={criteriosMaster}
                            onAddCategoria={async (categoria) => {
                                const novaEstrutura = [...estruturaRelatorio, categoria];
                                await salvarEstruturaRelatorio(novaEstrutura);
                            }}
                            onUpdateCategoria={async (categoriaId, dados) => {
                                console.log('Atualizar categoria:', categoriaId, dados);
                            }}
                            onDeleteCategoria={async (categoriaId) => {
                                const novaEstrutura = estruturaRelatorio.filter(c => c.id !== categoriaId);
                                await salvarEstruturaRelatorio(novaEstrutura);
                            }}
                            onAddItem={async (categoriaId, item) => {
                                const novaEstrutura = estruturaRelatorio.map(cat => 
                                    cat.id === categoriaId 
                                        ? { ...cat, itens: [...cat.itens, item] }
                                        : cat
                                );
                                await salvarEstruturaRelatorio(novaEstrutura);
                            }}
                            onUpdateItem={async (categoriaId, itemId, dados) => {
                                const novaEstrutura = estruturaRelatorio.map(cat => 
                                    cat.id === categoriaId 
                                        ? { 
                                            ...cat, 
                                            itens: cat.itens.map(item => 
                                                item.id === itemId ? { ...item, ...dados } : item
                                            )
                                        }
                                        : cat
                                );
                                await salvarEstruturaRelatorio(novaEstrutura);
                            }}
                            onDeleteItem={async (categoriaId, itemId) => {
                                const novaEstrutura = estruturaRelatorio.map(cat => 
                                    cat.id === categoriaId 
                                        ? { ...cat, itens: cat.itens.filter(item => item.id !== itemId) }
                                        : cat
                                );
                                await salvarEstruturaRelatorio(novaEstrutura);
                            }}
                            onAddCriterio={async (categoriaId, itemId, criterioId) => {
                                const criterio = criteriosMaster.find(c => c.id === criterioId);
                                if (criterio) {
                                    const novaEstrutura = estruturaRelatorio.map(cat => 
                                        cat.id === categoriaId 
                                            ? { 
                                                ...cat, 
                                                itens: cat.itens.map(item => 
                                                    item.id === itemId 
                                                        ? { ...item, criterios: [...item.criterios, criterio] }
                                                        : item
                                                )
                                            }
                                            : cat
                                    );
                                    await salvarEstruturaRelatorio(novaEstrutura);
                                }
                            }}
                            onRemoveCriterio={async (categoriaId, itemId, criterioId) => {
                                const novaEstrutura = estruturaRelatorio.map(cat => 
                                    cat.id === categoriaId 
                                        ? { 
                                            ...cat, 
                                            itens: cat.itens.map(item => 
                                                item.id === itemId 
                                                    ? { ...item, criterios: item.criterios.filter(c => c.id !== criterioId) }
                                                    : item
                                            )
                                        }
                                        : cat
                                );
                                await salvarEstruturaRelatorio(novaEstrutura);
                            }}
                        />
                    )}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-start">
                    <Link to={`/editais/${editalId}/relatorios/${relatorioId}/configurar`}>
                        <Button variant="ghost" icon={ChevronLeft}>
                            Voltar para o Hub
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GerenciarEstruturaPage; 