import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select, { SelectOption } from '../../../components/ui/Select';
import { DatePicker } from '../../../components/ui/DatePicker';
import Modal from '../../../components/ui/Modal';
import { useCalendario, CalendarioAgrupado, EventoCalendario, Evento } from '../../../hooks/useCalendario';
import StatusBadge from '../../../components/ui/StatusBadge';

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modoEdicao ? 'Editar Evento' : 'Adicionar Evento'}
            variant="glass"
            size="md"
        >
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium mb-1">
                            Atividade
                        </label>
                    <div className="p-2 bg-white/50 dark:bg-gray-700/50 rounded border border-gray-300 dark:border-gray-600 text-sm">
                            {atividadeContexto.descricao}
                        </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium mb-1">
                            Evento {modoEdicao && <span className="text-orange-500">(Editando evento existente)</span>}
                        </label>
                        <Select
                            options={eventosDisponiveis}
                            value={eventoSelecionado}
                            onChange={handleEventoChange}
                            placeholder="Selecione o evento..."
                        />
                    </div>

                {eventoSelecionado && (
                    <>
                    <div>
                        <DatePicker
                            label="Data Inicial"
                            value={dataInicio}
                            onChange={setDataInicio}
                        />
                    </div>
                    <div>
                        <DatePicker
                            label="Data Final"
                            value={dataFim}
                            onChange={setDataFim}
                        />
                    </div>
                    </>
                )}
                </div>

            <div className="mt-6 flex justify-end space-x-2">
                <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                <Button
                    variant="primary"
                    onClick={handleSaveClick}
                    disabled={!eventoSelecionado || !dataInicio || !dataFim}
                >
                    Salvar
                    </Button>
            </div>
        </Modal>
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
                                        <h2 className="text-xl font-semibold text-primary dark:text-primary-light">
                                            {atividade.atividadeDescricao}
                                        </h2>
                                        {/* Pill de status dinâmico */}
                                        <StatusBadge
                                            status={completo ? 'Completo' : `${eventosObrigatorios.length - atividade.eventos.filter(e => eventosObrigatorios.includes(e.eventoDescricao || '')).length} Eventos Pendentes`}
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
                                        Gerencie os eventos do calendário desta atividade.
                                    </p>
                                </Card.Content>
                                <Card.Footer>
                                    <Button
                                        variant="primary"
                                        className="flex-1"
                                        onClick={() => handleOpenModalAdicionar(atividade)}
                                    >
                                        Gerenciar &gt;
                                    </Button>
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