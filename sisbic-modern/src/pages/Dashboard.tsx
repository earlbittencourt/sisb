import React from 'react';
import Card from '../components/ui/Card';
import { Users, GraduationCap, Award, TrendingUp, Activity, BarChart3, PieChart, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Pie, Cell, PieChart as RechartsPieChart } from 'recharts';

const Dashboard: React.FC = () => {
  const chartData = [
    { name: 'Jan', bolsistas: 45, projetos: 12 }, { name: 'Fev', bolsistas: 52, projetos: 15 },
    { name: 'Mar', bolsistas: 48, projetos: 18 }, { name: 'Abr', bolsistas: 61, projetos: 22 },
    { name: 'Mai', bolsistas: 55, projetos: 25 }, { name: 'Jun', bolsistas: 67, projetos: 28 }
  ];
  const pieData = [
    { name: 'PIBIC', value: 45, color: 'var(--ufba-blue)' }, { name: 'PIBITI', value: 25, color: 'var(--ufba-gold)' },
    { name: 'PIBIC-AF', value: 20, color: 'var(--ufba-success)' }, { name: 'PIBIC-EM', value: 10, color: 'var(--ufba-danger)' }
  ];
  const stats = [
    { title: 'Total de Bolsistas', value: '342', change: '+12%', icon: Users, color: 'text-ufba-blue' },
    { title: 'Projetos Ativos', value: '156', change: '+8%', icon: GraduationCap, color: 'text-ufba-gold' },
    { title: 'Taxa de Aprovação', value: '87%', change: '+5%', icon: Award, color: 'text-ufba-success' },
    { title: 'Orçamento Utilizado', value: 'R$ 2.4M', change: '+15%', icon: TrendingUp, color: 'text-ufba-info' }
  ];

  const recentActivities = [
    { id: 1, title: 'Novo projeto aprovado: PIBIC - Análise de Dados', time: '2h atrás', type: 'success' },
    { id: 2, title: 'Relatório enviado: Relatório mensal de atividades', time: '4h atrás', type: 'info' },
    { id: 3, title: 'Bolsista cadastrado: João Silva - Engenharia', time: '6h atrás', type: 'success' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="liquid-card p-3">
          <p className="font-bold text-text-primary">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.stroke || pld.fill }}>
              {`${pld.name}: ${pld.value}`}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Visão geral do sistema de bolsas de iniciação científica</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">{stat.title}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                <p className="text-sm text-ufba-success font-medium mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <h3 className="font-semibold text-text-primary mb-4">Evolução Mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="name" stroke="var(--text-tertiary)" />
              <YAxis stroke="var(--text-tertiary)" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="bolsistas" stroke="var(--ufba-blue)" strokeWidth={2} />
              <Line type="monotone" dataKey="projetos" stroke="var(--ufba-gold)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-text-primary mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-ufba-success' : 'bg-ufba-info'
                }`} />
                <div>
                  <p className="text-sm font-medium text-text-primary">{activity.title}</p>
                  <p className="text-xs text-text-tertiary">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard; 