import { TimelineStep } from '../ui/TimelineStep';
import Button from '../ui/Button';

export function HeroEditalCard({ edital }: { edital: any }) {
  // Exemplo de eventos, substitua por dados reais do edital
  const eventos = [
    { label: 'Submissão de Projetos', dateRange: '01/02 - 28/02', status: 'completed' },
    { label: 'Avaliação dos Projetos', dateRange: '01/03 - 31/03', status: 'active' },
    { label: 'Indicação de Bolsistas', dateRange: '01/04 - 15/04', status: 'upcoming' },
  ];
  return (
    <div className="bg-surface-1 dark:bg-surface-dark-1 border border-border-color dark:border-border-dark rounded-lg p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Lado Esquerdo: Informações e Ação */}
        <div>
          <h2 className="font-serif text-3xl mb-2">{edital.nome}</h2>
          <p className="text-content-secondary dark:text-content-secondary-dark mb-6">Este é o edital ativo, com inscrições abertas. Acompanhe as etapas e gerencie as principais ações.</p>
          <Button variant="primary" size="lg">Gerenciar Edital →</Button>
        </div>
        {/* Lado Direito: Timeline de Eventos */}
        <div className="border-l border-border-color dark:border-border-dark pl-8 space-y-6">
          {eventos.map((ev, idx) => (
            <TimelineStep key={idx} label={ev.label} dateRange={ev.dateRange} status={ev.status as any} />
          ))}
        </div>
      </div>
    </div>
  );
} 