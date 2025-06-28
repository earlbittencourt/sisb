import React from 'react';
import { FileText, Clock, CheckCircle, Users, TrendingUp, Activity } from 'lucide-react';
import DashboardCard from '../components/ui/DashboardCard';

const Dashboard = () => {
  // Dados mockados para demonstração
  const metrics = {
    totalEditais: 24,
    emAndamento: 8,
    inscricoesAbertas: 3,
    concluidos: 13,
    totalBolsistas: 156,
    novosEsteMes: 12
  };

  return (
    <div className="content-area">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Visão geral do sistema de bolsas da UFBA
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total de Editais"
          value={metrics.totalEditais.toString()}
          icon={FileText}
          trend={{ value: "+5.2%", direction: 'up' }}
        />
        <DashboardCard
          title="Em Andamento"
          value={metrics.emAndamento.toString()}
          icon={Clock}
          trend={{ value: "+12.5%", direction: 'up' }}
        />
        <DashboardCard
          title="Inscrições Abertas"
          value={metrics.inscricoesAbertas.toString()}
          icon={Activity}
          trend={{ value: "+8.1%", direction: 'up' }}
        />
        <DashboardCard
          title="Concluídos"
          value={metrics.concluidos.toString()}
          icon={CheckCircle}
          trend={{ value: "+3.7%", direction: 'up' }}
        />
        <DashboardCard
          title="Total de Bolsistas"
          value={metrics.totalBolsistas.toString()}
          icon={Users}
          trend={{ value: "+15.3%", direction: 'up' }}
        />
        <DashboardCard
          title="Novos Este Mês"
          value={metrics.novosEsteMes.toString()}
          icon={TrendingUp}
          trend={{ value: "+22.1%", direction: 'up' }}
        />
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-neutral-800 shadow-elite rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Novo edital publicado', time: '2 horas atrás', type: 'info' },
              { title: 'Inscrições encerradas', time: '1 dia atrás', type: 'warning' },
              { title: 'Bolsista aprovado', time: '2 dias atrás', type: 'success' },
              { title: 'Relatório gerado', time: '3 dias atrás', type: 'info' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-success' :
                  activity.type === 'warning' ? 'bg-warning' :
                  'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {activity.title}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-neutral-800 shadow-elite rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-primary p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Novo Edital</span>
            </button>
            <button className="btn-secondary p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Gerenciar Bolsistas</span>
            </button>
            <button className="btn-secondary p-4 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Relatórios</span>
            </button>
            <button className="btn-secondary p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Calendário</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 