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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-content-main dark:text-content-main-dark mb-2">
          Dashboard
        </h1>
        <p className="text-content-secondary dark:text-content-secondary-dark">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna de Atividades Recentes */}
        <div className="lg:col-span-2">
          <div className="bg-surface-1 dark:bg-surface-dark-1 shadow-elite rounded-lg p-6">
            <h3 className="text-lg font-semibold text-content-main dark:text-content-main-dark mb-4">
              Atividade Recente
            </h3>
            <div className="space-y-2">
              {[
                { icon: FileText, text: 'Novo edital "PIBIC 2024" foi publicado.', time: '2h atrás' },
                { icon: CheckCircle, text: 'Avaliação do projeto "IA na Saúde" foi concluída.', time: '5h atrás' },
                { icon: Clock, text: 'Relatório parcial do edital "PIBITI 2023" está pendente.', time: '1 dia atrás' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-0 dark:hover:bg-surface-dark-0/50 transition-colors">
                  <div className="bg-surface-0 dark:bg-surface-dark-0 p-2 rounded-full">
                    <item.icon className="w-5 h-5 text-content-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-content-main dark:text-content-main-dark">
                      {item.text}
                    </p>
                    <p className="text-xs text-content-secondary dark:text-content-secondary-dark">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna de Atalhos */}
        <div>
          <div className="bg-surface-1 dark:bg-surface-dark-1 shadow-elite rounded-lg p-6">
            <h3 className="text-lg font-semibold text-content-main dark:text-content-main-dark mb-4">
              Acesso Rápido
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
    </div>
  );
};

export default Dashboard; 