import React, { useEffect, ReactNode } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { EditalProvider, useEdital } from '../contexts/EditalContext';

// Este componente busca os dados e gerencia os estados de carregamento/erro.
// Ele só renderiza o conteúdo real (via <Outlet />) quando os dados estão prontos.
const EditalDataFetcher: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // Usamos o contexto para obter a função de busca e o estado
    const { fetchEditalData, loading, error } = useEdital();

    useEffect(() => {
        // Busca os dados quando o componente é montado ou o ID muda
        if (id) {
            fetchEditalData(Number(id));
        }
    }, [id, fetchEditalData]);

    // Exibe um estado de carregamento centralizado
    if (loading) {
        return (
            <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-lg text-text-secondary">Carregando configuração do edital...</p>
            </div>
        );
    }
    
    // Exibe um estado de erro centralizado
    if (error) {
        return (
            <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-500">Ocorreu um erro: {error}</p>
            </div>
        );
    }
    
    // Se não está carregando e não há erro, os dados estão prontos. Renderiza a página filha.
    return <Outlet />;
};


// Este é o componente de layout usado no roteador.
// Sua única responsabilidade é fornecer o contexto para seus filhos.
const EditalConfigLayout: React.FC = () => {
    return (
        <EditalProvider>
            <EditalDataFetcher />
        </EditalProvider>
    );
};

// Layout específico para criação de novo edital
// Não busca dados de um edital existente
export const EditalNovoLayout: React.FC = () => {
    return (
        <EditalProvider>
            <Outlet />
        </EditalProvider>
    );
};

export default EditalConfigLayout; 