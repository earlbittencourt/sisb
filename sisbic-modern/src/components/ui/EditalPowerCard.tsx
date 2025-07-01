import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Calendar, Users, ChevronRight, BarChart3, CheckCircle, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import StatusBadge from './StatusBadge';
import ProgressCircle from './ProgressCircle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EditalPowerCardProps {
  edital: {
    PEP_Codigo: number;
    PEP_Descricao: string;
    PEP_DtInicio: string;
    PEP_DtFim: string;
    PPS_Descricao?: string;
    PRO_Descricao: string;
    // Dados simulados para o protótipo
    projetosSubmetidos?: number;
    projetosAvaliados?: number;
    distribuicaoComite?: number;
    evolucaoSubmissoes?: { data: string; quantidade: number }[];
  };
  className?: string;
}

export function EditalPowerCard({ edital, className }: EditalPowerCardProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const navigate = useNavigate();

  // Simulação de eventos (em produção, viria do backend)
  const eventos = [
    { nome: 'Distribuição de projetos', data: '10 Mar' },
    { nome: 'Início das avaliações', data: '15 Mar' },
    { nome: 'Resultado final', data: '30 Mar' },
  ];
  const eventoAtual = eventos[0];
  const proximoEvento = eventos[1];

  // Ações contextuais baseadas no status do edital
  const getAcoesContextuais = () => {
    const status = edital.PPS_Descricao?.toLowerCase() || '';
    
    if (status.includes('inscrição') || status.includes('inscricao')) {
      return [
        { label: 'Estruturar Formulário', icon: FileText, href: `/editais/${edital.PEP_Codigo}/configurar/submissao` },
        { label: 'Definir Comitê', icon: Users, href: `/editais/${edital.PEP_Codigo}/configurar/comite` },
      ];
    }
    
    if (status.includes('andamento')) {
      return [
        { label: 'Distribuir Projetos', icon: Users, href: `/editais/${edital.PEP_Codigo}/distribuicao` },
        { label: 'Ver Relatórios', icon: BarChart3, href: `/editais/${edital.PEP_Codigo}/relatorios` },
      ];
    }
    
    return [];
  };

  const acoesContextuais = getAcoesContextuais();

  // Dados genéricos para o gráfico (crescente, semana a semana)
  const evolucaoSemanal = [
    { data: '24 Fev', valor: 30 },
    { data: '01 Mar', valor: 45 },
    { data: '08 Mar', valor: 60 },
    { data: '15 Mar', valor: 80 },
    { data: '22 Mar', valor: 120 },
    { data: '29 Mar', valor: 135 },
    { data: '05 Abr', valor: 150 },
    { data: '12 Abr', valor: 180 },
  ];

  return (
    <div
      className={cn(
        'bg-surface-1 dark:bg-surface-dark-1 border border-border-color dark:border-border-dark rounded-xl overflow-hidden',
        'transition-all duration-200 hover:shadow-subtle cursor-pointer',
        'flex flex-col',
        className
      )}
      onClick={() => navigate(`/admin/edital/${edital.PEP_Codigo}`)}
      tabIndex={0}
      role="button"
      aria-label={`Gerenciar edital ${edital.PEP_Descricao}`}
    >
      {/* Cabeçalho forte */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-border-color dark:border-border-dark">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-brand-primary dark:text-brand-primary-dark" />
          <h3 className="text-base font-semibold text-content-main dark:text-content-main-dark">
            {edital.PEP_Descricao}
          </h3>
        </div>
        <button className="p-2 rounded-full hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition" tabIndex={-1} onClick={e => e.stopPropagation()}>
          <MoreHorizontal className="w-5 h-5 text-content-secondary dark:text-content-secondary-dark" />
        </button>
      </div>

      {/* Linha principal: eventos | projetos submetidos | gráfico (gráfico ocupa duas linhas) */}
      <div className="px-6 pt-6 pb-2 grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 items-center">
        {/* Coluna 1, Linha 1: Eventos */}
        <div className="row-start-1 col-start-1">
          <div className="text-sm font-semibold text-brand-primary dark:text-brand-primary-dark">
            {eventoAtual.nome} - {eventoAtual.data}
          </div>
          <div className="text-xs text-content-secondary dark:text-content-secondary-dark mt-1">
            Próximo: {proximoEvento.nome} - {proximoEvento.data}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Calendar className="w-4 h-4 text-content-secondary dark:text-content-secondary-dark" />
            <span className="text-xs font-medium text-content-secondary dark:text-content-secondary-dark">{formatDate(edital.PEP_DtInicio)} - {formatDate(edital.PEP_DtFim)}</span>
          </div>
        </div>
        {/* Coluna 2, Linha 1: Projetos Submetidos */}
        <div className="row-start-1 col-start-2 flex flex-col items-center justify-center">
          <span className="text-xs font-medium text-content-secondary dark:text-content-secondary-dark mb-1">Projetos Submetidos</span>
          <span className="text-2xl font-bold text-brand-primary dark:text-brand-primary-dark">{edital.projetosSubmetidos ?? 27}</span>
        </div>
        {/* Coluna 3, Linha 1-2: Gráfico ocupa as duas linhas */}
        <div className="row-start-1 row-end-3 col-start-3 w-full h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={evolucaoSemanal} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="data" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 'dataMax + 2']} />
              <Tooltip formatter={(value) => [`Projetos Submetidos: ${value}`]} />
              <Line type="monotone" dataKey="valor" stroke="#0EA5E9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Linha 2: Ações contextuais lado a lado, fonte menor */}
        <div className="row-start-2 col-start-1 col-span-2 flex flex-row gap-3 mt-2">
          <a href="#" className="text-sm font-medium text-brand-primary text-left hover:underline transition">Ação Contextual 1</a>
          <a href="#" className="text-sm font-medium text-brand-primary text-left hover:underline transition">Ação Contextual 2</a>
        </div>
      </div>
    </div>
  );
} 