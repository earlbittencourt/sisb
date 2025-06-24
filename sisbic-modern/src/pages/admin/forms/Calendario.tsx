import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, Edit, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle, Save, X, Settings, Play, ChevronLeft, Trash2 } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select, { SelectOption } from '../../../components/ui/Select';
import { DatePicker } from '../../../components/ui/DatePicker';
import { useCalendario, CalendarioAgrupado, EventoCalendario, Evento, NovoEventoCalendario } from '../../../hooks/useCalendario';

// Componente para o Modal de Edição/Adição
const EventoModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    eventoEditando: EventoCalendario | null;
    eventosDisponiveis: SelectOption[];
    atividadeContexto: { id: number; descricao: string };
    eventosCadastrados: EventoCalendario[];
}> = ({ isOpen, onClose, onSave, eventoEditando, eventosDisponiveis, atividadeContexto, eventosCadastrados }) => {
    const { id: editalId } = useParams<{ id: string }>();
    const [eventoSelecionado, setEventoSelecionado] = useState<string | number>('');
    const [dataInicio, setDataInicio] = useState<Date | undefined>();
    const [dataFim, setDataFim] = useState<Date | undefined>();
    const [modoEdicao, setModoEdicao] = useState(false);
    const [eventoOriginal, setEventoOriginal] = useState<EventoCalendario | null>(null);

    // Reset do modal quando abre
    useEffect(() => {
        if (isOpen) {
            if (eventoEditando) {
                // Modo edição - preenche com dados do evento
                setEventoSelecionado(eventoEditando.eventoId || '');
                setDataInicio(eventoEditando.dataInicio ? new Date(eventoEditando.dataInicio) : undefined);
                setDataFim(eventoEditando.dataFim ? new Date(eventoEditando.dataFim) : undefined);
                setModoEdicao(true);
                setEventoOriginal(eventoEditando);
            } else {
                // Modo adição - limpa campos
                setEventoSelecionado('');
                setDataInicio(undefined);
                setDataFim(undefined);
                setModoEdicao(false);
                setEventoOriginal(null);
            }
        }
    }, [isOpen, eventoEditando]);

    // Quando seleciona um evento, verifica se já existe e preenche automaticamente
    const handleEventoChange = (eventoId: string | number) => {
        setEventoSelecionado(eventoId);
        
        // Verifica se o evento já está cadastrado para esta atividade
        const eventoExistente = eventosCadastrados.find(e => e.eventoId === eventoId);
        
        if (eventoExistente) {
            // Preenche com dados existentes
            setDataInicio(eventoExistente.dataInicio ? new Date(eventoExistente.dataInicio) : undefined);
            setDataFim(eventoExistente.dataFim ? new Date(eventoExistente.dataFim) : undefined);
            setModoEdicao(true);
            setEventoOriginal(eventoExistente);
        } else {
            // Novo evento - limpa datas
            setDataInicio(undefined);
            setDataFim(undefined);
            setModoEdicao(false);
            setEventoOriginal(null);
        }
    };

    const handleSaveClick = () => {
        if (!eventoSelecionado || !dataInicio || !dataFim) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const data = {
            editalId: parseInt(editalId || '0'),
            eventoId: parseInt(eventoSelecionado.toString()),
            atividadeId: atividadeContexto.id,
            dataInicio: dataInicio.toISOString(),
            dataFim: dataFim.toISOString(),
            usuario: 'admin', // TODO: pegar do contexto de autenticação
            // Campos para identificação se é edição
            modoEdicao,
            eventoOriginal
        };

        onSave(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 relative z-[51]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {modoEdicao ? 'Editar Evento' : 'Adicionar Evento'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Atividade
                        </label>
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-200">
                            {atividadeContexto.descricao}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Evento {modoEdicao && <span className="text-orange-500">(Editando evento existente)</span>}
                        </label>
                        <Select
                            options={eventosDisponiveis}
                            value={eventoSelecionado}
                            onChange={handleEventoChange}
                            placeholder="Selecione o evento..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data de Início *
                        </label>
                        <DatePicker
                            value={dataInicio}
                            onChange={setDataInicio}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data de Fim *
                        </label>
                        <DatePicker
                            value={dataFim}
                            onChange={setDataFim}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveClick}>
                        {modoEdicao ? 'Atualizar' : 'Salvar'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Componente de Progresso Circular
const ProgressCircle: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({ 
    progress, 
    size = 60, 
    strokeWidth = 4 
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const getProgressColor = (progress: number) => {
        if (progress === 100) return '#10B981'; // green-500
        if (progress >= 70) return '#3B82F6'; // blue-500
        if (progress >= 40) return '#F59E0B'; // amber-500
        return '#EF4444'; // red-500
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="dark:stroke-gray-600"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getProgressColor(progress)}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-in-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {progress}%
                </span>
            </div>
        </div>
    );
};

const Calendario: React.FC = () => {
    const { id: editalId } = useParams<{ id: string }>();
    const [calendarioAgrupado, setCalendarioAgrupado] = useState<CalendarioAgrupado[]>([]);
    const [eventosDisponiveis, setEventosDisponiveis] = useState<Evento[]>([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventoEditando, setEventoEditando] = useState<EventoCalendario | null>(null);
    const [atividadeContexto, setAtividadeContexto] = useState<{ id: number; descricao: string } | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        loading,
        error,
        fetchEventos,
        fetchCalendarioEdital,
        adicionarEventoCalendario,
        atualizarEventoCalendario,
        excluirEventoCalendario,
        clearError,
    } = useCalendario();

    // Eventos obrigatórios por atividade
    const eventosObrigatorios = {
        projeto: [
            'Submeter',
            'Distribuir', 
            'Avaliar',
            'Recurso',
            'Indicação de Bolsista',
            'Avaliação Local',
            'Avaliação Externa'
        ],
        relatorio: ['Submeter', 'Distribuir', 'Avaliar', 'Avaliar CE']
    };

    // Função para verificar se um evento é obrigatório
    const isEventoObrigatorio = (atividadeNome: string, eventoNome: string): boolean => {
        const atividadeLower = atividadeNome.toLowerCase();
        
        if (atividadeLower.includes('projeto')) {
            return eventosObrigatorios.projeto.includes(eventoNome);
        } else if (atividadeLower.includes('relatório') || atividadeLower.includes('relatorio')) {
            return eventosObrigatorios.relatorio.includes(eventoNome);
        }
        
        // Para outras atividades, todos os eventos são considerados obrigatórios
        return true;
    };

    const carregarCalendario = useCallback(async () => {
        if (editalId) {
            const [calendarioData, eventosData] = await Promise.all([
                fetchCalendarioEdital(editalId),
                fetchEventos()
            ]);
            setCalendarioAgrupado(calendarioData);
            setEventosDisponiveis(eventosData);
        }
    }, [editalId, fetchCalendarioEdital, fetchEventos]);

    useEffect(() => {
        carregarCalendario();
    }, [carregarCalendario]);

    // Exibir e limpar mensagens de erro/sucesso
    useEffect(() => {
        if (error) setTimeout(() => clearError(), 5000);
    }, [error, clearError]);

    useEffect(() => {
        if (successMessage) setTimeout(() => setSuccessMessage(null), 3000);
    }, [successMessage]);

    // Calcular progresso da atividade
    const calcularProgresso = (atividade: CalendarioAgrupado): { progresso: number; completo: boolean; eventosObrigatorios: string[] } => {
        const atividadeNome = atividade.atividadeDescricao.toLowerCase();
        let eventosObrigatoriosNomes: string[];

        if (atividadeNome.includes('projeto')) {
            // Para "Projeto", apenas os eventos específicos são obrigatórios
            const nomesObrigatoriosProjeto = [
                'Submeter',
                'Distribuir', 
                'Avaliar',
                'Recurso',
                'Indicação de Bolsista',
                'Avaliação Local',
                'Avaliação Externa'
            ];
            eventosObrigatoriosNomes = eventosDisponiveis
                .filter(e => nomesObrigatoriosProjeto.includes(e.descricao))
                .map(e => e.descricao);
        } else if (atividadeNome.includes('relatório') || atividadeNome.includes('relatorio')) {
            // Para "Relatório", apenas um subconjunto específico é obrigatório.
            const nomesObrigatoriosRelatorio = ['Submeter', 'Distribuir', 'Avaliar', 'Avaliar CE'];
            eventosObrigatoriosNomes = eventosDisponiveis
                .filter(e => nomesObrigatoriosRelatorio.includes(e.descricao))
                .map(e => e.descricao);
        } else {
            // Para outras atividades, consideramos todos os eventos disponíveis como obrigatórios.
            eventosObrigatoriosNomes = eventosDisponiveis.map(e => e.descricao);
        }
        
        if (eventosObrigatoriosNomes.length === 0 && atividade.eventos.length === 0) {
            // Se não há eventos obrigatórios definidos nem eventos configurados, o progresso é 0.
             return { progresso: 0, completo: false, eventosObrigatorios: eventosObrigatoriosNomes };
        }
        
        if (eventosObrigatoriosNomes.length === 0) {
            // Se não há eventos obrigatórios, mas há eventos configurados, considerar como 100% completo.
            return { progresso: 100, completo: true, eventosObrigatorios: [] };
        }

        const eventosConfiguradosNomes = atividade.eventos.map(e => e.eventoDescricao || '');
        
        const obrigatoriosConfiguradosCount = eventosObrigatoriosNomes.filter(nome => 
            eventosConfiguradosNomes.includes(nome)
        ).length;

        const progresso = Math.round((obrigatoriosConfiguradosCount / eventosObrigatoriosNomes.length) * 100);

        return {
            progresso,
            completo: progresso === 100,
            eventosObrigatorios: eventosObrigatoriosNomes
        };
    };

    const handleOpenModalAdicionar = (atividade: CalendarioAgrupado) => {
        setAtividadeContexto({ id: atividade.atividadeId, descricao: atividade.atividadeDescricao });
        setEventoEditando(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAtividadeContexto(null);
        setEventoEditando(null);
    };

    const handleSaveEvento = async (data: any) => {
        try {
            if (data.modoEdicao && data.eventoOriginal) {
                // Modo edição - atualiza evento existente
                await atualizarEventoCalendario(data.eventoOriginal.id, {
                    editalId: data.editalId,
                    eventoId: data.eventoId,
                    atividadeId: data.atividadeId,
                    dataInicio: data.dataInicio,
                    dataFim: data.dataFim,
                    usuario: data.usuario
                });
            } else {
                // Modo adição - cria novo evento
                await adicionarEventoCalendario({
                    editalId: data.editalId,
                    eventoId: data.eventoId,
                    atividadeId: data.atividadeId,
                    dataInicio: data.dataInicio,
                    dataFim: data.dataFim,
                    usuario: data.usuario
                });
            }
            
            handleCloseModal();
            await carregarCalendario(); // Recarrega os dados
        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            alert('Erro ao salvar evento. Tente novamente.');
        }
    };

    const handleDeleteEvento = async (evento: EventoCalendario, atividade: CalendarioAgrupado) => {
        // Verifica se o evento é obrigatório
        if (isEventoObrigatorio(atividade.atividadeDescricao, evento.eventoDescricao || '')) {
            alert('Não é possível excluir um evento obrigatório.');
            return;
        }

        if (window.confirm(`Tem certeza que deseja excluir o evento "${evento.eventoDescricao}"?`)) {
            try {
                await excluirEventoCalendario(evento.id);
                await carregarCalendario(); // Recarrega os dados
            } catch (error) {
                console.error('Erro ao excluir evento:', error);
                alert('Erro ao excluir evento. Tente novamente.');
            }
        }
    };

    const getStatus = (evento: EventoCalendario): { texto: string; cor: string; Icon: React.ElementType } => {
        const agora = new Date();
        const dataFim = new Date(evento.dataFim);
        
        if (agora > dataFim) return { texto: 'Finalizado', cor: 'text-green-500', Icon: CheckCircle };
        if (agora >= new Date(evento.dataInicio) && agora <= dataFim) return { texto: 'Em Andamento', cor: 'text-blue-500', Icon: Clock };
        if (agora < new Date(evento.dataInicio)) return { texto: 'Agendado', cor: 'text-amber-500', Icon: CalendarIcon };
        
        return { texto: 'Status Desconhecido', cor: 'text-gray-400', Icon: AlertCircle };
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Cabeçalho e Notificações */}
            <div>
                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Calendário do Edital</h1>
                 <p className="text-md text-gray-500 dark:text-gray-400 mt-1">
                     Configure o calendário para definir as datas importantes de cada atividade.
                 </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="text-red-500 mr-2" size={20} />
                    <span className="text-red-700">{error}</span>
                </div>
            )}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="text-green-500 mr-2" size={20} />
                    <span className="text-green-700">{successMessage}</span>
                </div>
            )}
            
            {/* Grid de Atividades */}
            {loading && calendarioAgrupado.length === 0 ? (
                 <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-text-secondary">Carregando atividades...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {calendarioAgrupado.map((atividade) => {
                        const { progresso, completo, eventosObrigatorios } = calcularProgresso(atividade);
                        
                        return (
                            <Card key={atividade.atividadeId} className="group transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl dark:hover:shadow-cyan-500/20">
                                <Card.Header>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                            {atividade.atividadeDescricao}
                                        </h2>
                                        <div className="flex items-center space-x-2">
                                            {completo ? (
                                                <div className="flex items-center text-green-600 dark:text-green-400">
                                                    <CheckCircle size={20} className="mr-1" />
                                                    <span className="text-sm font-medium">Completo</span>
                                                </div>
                                            ) : (
                                                <ProgressCircle progress={progresso} />
                                            )}
                                        </div>
                                    </div>
                                </Card.Header>
                                
                                <Card.Content>
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Configure o calendário para {atividade.atividadeDescricao.toLowerCase()}
                                        </p>
                                        
                                        {/* Lista de eventos */}
                                        <div className="space-y-2 mt-3">
                                            {atividade.eventos.length > 0 ? (
                                                atividade.eventos.map((evento) => {
                                                    const isObrigatorio = isEventoObrigatorio(atividade.atividadeDescricao, evento.eventoDescricao || '');
                                                    return (
                                                        <div key={evento.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock size={14} className="text-gray-500 dark:text-gray-400" />
                                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                                        {evento.eventoDescricao}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                    {new Date(evento.dataInicio).toLocaleDateString('pt-BR')} - {new Date(evento.dataFim).toLocaleDateString('pt-BR')}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                {(() => {
                                                                    const status = getStatus(evento);
                                                                    if (status.texto === 'Finalizado') {
                                                                        return null;
                                                                    }
                                                                    return status.Icon ? (
                                                                        <status.Icon 
                                                                            size={14} 
                                                                            className={status.cor} 
                                                                        />
                                                                    ) : null;
                                                                })()}
                                                                {!isObrigatorio && (
                                                                    <button
                                                                        onClick={() => handleDeleteEvento(evento, atividade)}
                                                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                                        title="Excluir evento"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    <CalendarIcon size={24} className="mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">Nenhum evento configurado</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {!completo && eventosObrigatorios.length > 0 && (
                                            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                                                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                                                    Eventos obrigatórios pendentes:
                                                </h4>
                                                <div className="space-y-1">
                                                    {eventosObrigatorios
                                                        .filter(evento => !atividade.eventos.some(e => e.eventoDescricao === evento))
                                                        .slice(0, 3)
                                                        .map(evento => (
                                                            <div key={evento} className="flex items-center text-xs text-amber-700 dark:text-amber-300">
                                                                <AlertCircle size={12} className="mr-1" />
                                                                {evento}
                                                            </div>
                                                        ))}
                                                    {eventosObrigatorios.filter(evento => 
                                                        !atividade.eventos.some(e => e.eventoDescricao === evento)
                                                    ).length > 3 && (
                                                        <p className="text-xs text-amber-600 dark:text-amber-400">
                                                            +{eventosObrigatorios.filter(evento => 
                                                                !atividade.eventos.some(e => e.eventoDescricao === evento)
                                                            ).length - 3} eventos pendentes
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card.Content>
                                
                                <Card.Footer>
                                    <div className="flex space-x-2">
                                        {completo ? (
                                            <Button 
                                                variant="primary" 
                                                className="flex-1" 
                                                onClick={() => handleOpenModalAdicionar(atividade)}
                                            >
                                                <Settings className="mr-2" size={16} />
                                                Editar
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="primary" 
                                                className="flex-1" 
                                                onClick={() => handleOpenModalAdicionar(atividade)}
                                            >
                                                <Play className="mr-2" size={16} />
                                                Configurar
                                            </Button>
                                        )}
                                    </div>
                                </Card.Footer>
                            </Card>
                        );
                    })}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link to={`/editais/${editalId}/configurar`}>
                    <Button variant="secondary">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Voltar para o Hub
                    </Button>
                </Link>
            </div>
            
            {isModalOpen && atividadeContexto && (
                <EventoModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveEvento}
                    eventoEditando={eventoEditando}
                    eventosDisponiveis={eventosDisponiveis.map(e => ({ value: e.id, label: e.descricao }))}
                    atividadeContexto={atividadeContexto}
                    eventosCadastrados={calendarioAgrupado.find(a => a.atividadeId === atividadeContexto.id)?.eventos || []}
                />
            )}
        </div>
    );
};

export default Calendario; 