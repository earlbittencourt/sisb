import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Programas from "./pages/admin/Programas";
import ConfigurarEdital from "./pages/admin/ConfigurarEdital";
import EditalDadosGerais from "./pages/admin/forms/EditalDadosGerais";
import AgenciasFomento from "./pages/admin/forms/AgenciasFomento";
import Calendario from "./pages/admin/forms/Calendario";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditalConfigLayout from "./layouts/EditalConfigLayout";
import SubmissaoConfig from "./pages/admin/forms/SubmissaoConfig";
import AvaliacaoProjetos from "./pages/admin/forms/AvaliacaoProjetos";
import AvaliacaoCurriculo from "./pages/admin/forms/AvaliacaoCurriculo";
import Relatorios from './pages/admin/forms/Relatorios';
import ConfigurarRelatorio from './pages/admin/forms/ConfigurarRelatorio';
import GerenciarConceitosPage from './pages/admin/forms/relatorios/GerenciarConceitosPage';
import GerenciarItensAvaliacaoPage from './pages/admin/forms/relatorios/GerenciarItensAvaliacaoPage';
import GerenciarEstruturaPage from './pages/admin/forms/relatorios/GerenciarEstruturaPage';
import React from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
    > {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Algo deu errado!</h1>
                        <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
                            Ocorreu um erro inesperado. Por favor, tente recarregar a página.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-ufba-blue text-white rounded-lg hover:bg-ufba-blue-dark transition-colors"
                        >
                            Recarregar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/editais",
                element: <Programas />,
            },
            {
                path: "/editais/:id/configurar",
                element: <EditalConfigLayout />,
                errorElement: (
                    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-red-500 mb-4">Erro na configuração do edital</h1>
                            <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
                                Ocorreu um erro ao carregar a configuração do edital.
                            </p>
                            <button
                                onClick={() => window.history.back()}
                                className="px-4 py-2 bg-ufba-blue text-white rounded-lg hover:bg-ufba-blue-dark transition-colors"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                ),
                children: [
                    {
                        index: true,
                        element: <ConfigurarEdital />,
                    },
                    {
                        path: "dados-gerais",
                        element: <EditalDadosGerais />,
                    },
                    {
                        path: "agencias-fomento",
                        element: <AgenciasFomento />,
                    },
                    {
                        path: "configuracao-submissao",
                        element: <SubmissaoConfig />,
                    },
                    {
                        path: "avaliacao-projetos",
                        element: <AvaliacaoProjetos />,
                    },
                    {
                        path: "avaliacao-curriculo",
                        element: <AvaliacaoCurriculo />,
                    },
                    {
                        path: "relatorios",
                        element: <Relatorios />,
                    },
                    {
                        path: "calendario",
                        element: <Calendario />,
                    }
                ]
            },
            {
                path: "/editais/:id/relatorios/:relatorioId/configurar",
                element: <ConfigurarRelatorio />,
                errorElement: (
                    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-red-500 mb-4">Erro na configuração do relatório</h1>
                            <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
                                Ocorreu um erro ao carregar a configuração do relatório.
                            </p>
                            <button
                                onClick={() => window.history.back()}
                                className="px-4 py-2 bg-ufba-blue text-white rounded-lg hover:bg-ufba-blue-dark transition-colors"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                ),
            },
            {
                path: "/editais/:id/relatorios/:relatorioId/configurar/conceitos",
                element: <GerenciarConceitosPage />,
            },
            {
                path: "/editais/:id/relatorios/:relatorioId/configurar/itens-avaliacao",
                element: <GerenciarItensAvaliacaoPage />,
            },
            {
                path: "/editais/:id/relatorios/:relatorioId/configurar/estrutura",
                element: <GerenciarEstruturaPage />,
            },
        ],
        errorElement: (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Página não encontrada</h1>
                    <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
                        A página que você está procurando não existe.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-ufba-blue text-white rounded-lg hover:bg-ufba-blue-dark transition-colors"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        ),
    },
]);

const queryClient = new QueryClient();

function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AuthProvider>
                        <RouterProvider router={router} />
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

export default App;