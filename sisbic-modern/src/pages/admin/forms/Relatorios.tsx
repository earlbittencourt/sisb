import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import { useRelatorios } from '../../../hooks/useRelatorios';
import ModalCriarRelatorio from '../../../components/ui/ModalCriarRelatorio';
import RelatorioCard from '../../../components/ui/RelatorioCard';
import Card from '../../../components/ui/Card';

const Relatorios: React.FC = () => {
    const { id: editalId } = useParams<{ id: string }>();
    const { relatorios, loading, error, criarRelatorio, deleteRelatorio } = useRelatorios(editalId);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveRelatorio = async (data: { descricao: string; avaliadores: number }) => {
        try {
            await criarRelatorio(data);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Falha ao salvar o relatório", err);
        }
    };

    const handleDeleteClick = async (relatorioId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita e apagará todas as configurações associadas.')) {
            try {
                await deleteRelatorio(relatorioId);
            } catch (err) {
                alert('Ocorreu um erro ao excluir o relatório.');
            }
        }
    };

    const renderRelatorios = () => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                         <Card key={index} className="flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 min-h-[260px] animate-pulse">
                            <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
                         </Card>
                    ))}
                </div>
            );
        }

        if (error) {
            return <div className="text-center py-10 text-red-500">{error}</div>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatorios.map(relatorio => (
                    <RelatorioCard 
                        key={relatorio.id} 
                        relatorio={relatorio}
                        onDelete={handleDeleteClick}
                    />
                ))}
                {/* Card para Adicionar Novo Relatório */}
                <Card 
                    className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer min-h-[260px]"
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 group-hover:text-blue-500" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Criar Novo Relatório
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Adicione um novo modelo de relatório para este edital.
                    </p>
                </Card>
            </div>
        );
    };

    return (
        <>
            <div className="p-6 bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-text-primary dark:text-text-primary-dark">
                            Configurar Relatórios
                        </h1>
                        <p className="text-lg text-text-secondary dark:text-text-secondary-dark mt-2">
                            Crie e gerencie os modelos de relatório para este edital.
                        </p>
                    </div>

                    {renderRelatorios()}

                    <div className="mt-8">
                        <Link to={`/editais/${editalId}/configurar`}>
                            <Button variant="secondary">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Voltar para o Hub
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <ModalCriarRelatorio 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveRelatorio}
            />
        </>
    );
};

export default Relatorios; 