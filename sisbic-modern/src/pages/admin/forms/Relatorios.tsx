import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { ChevronLeft, PlusCircle, ArrowLeft } from 'lucide-react';
import { useRelatorios } from '../../../hooks/useRelatorios';
import ModalCriarRelatorio from '../../../components/ui/ModalCriarRelatorio';
import RelatorioCard from '../../../components/ui/RelatorioCard';
import Card from '../../../components/ui/Card';

const Relatorios: React.FC = () => {
    const { id: editalId } = useParams<{ id: string }>();
    const { relatorios, loading, error, criarRelatorio } = useRelatorios(editalId);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveRelatorio = async (data: { descricao: string; avaliadores: number }) => {
        try {
            await criarRelatorio(data);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Falha ao salvar o relatório", err);
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
                    />
                ))}
                {/* Card para Adicionar Novo Relatório */}
                <Card 
                    className="flex flex-col items-center justify-center text-center h-full border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary dark:hover:border-primary-light cursor-pointer transition-colors min-h-[260px]"
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusCircle className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                    <span className="mt-4 font-semibold text-slate-600 dark:text-slate-300">Criar Novo Relatório</span>
                </Card>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Cabeçalho */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Configurar Relatórios
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Crie e gerencie os modelos de relatório para este edital.
                </p>
            </div>

            {/* Grid de Relatórios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatorios.map(relatorio => (
                    <RelatorioCard 
                        key={relatorio.id} 
                        relatorio={relatorio}
                    />
                ))}

                {/* Card para Adicionar Novo Relatório */}
                <Card 
                    className="flex flex-col items-center justify-center text-center h-full border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary dark:hover:border-primary-light cursor-pointer transition-colors min-h-[260px]"
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusCircle className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                    <span className="mt-4 font-semibold text-slate-600 dark:text-slate-300">Criar Novo Relatório</span>
                </Card>
            </div>

            {/* Botão Voltar */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link to={`/editais/${editalId}/configurar`}>
                    <Button 
                        variant="secondary"
                        icon={ArrowLeft}
                        iconPosition="left"
                    >
                        Voltar para o Hub
                    </Button>
                </Link>
            </div>

            {/* Modal de Criar Relatório */}
            <ModalCriarRelatorio
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveRelatorio}
            />
        </div>
    );
};

export default Relatorios; 