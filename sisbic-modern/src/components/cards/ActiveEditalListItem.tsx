import Button from '../ui/Button';

export function ActiveEditalListItem({ edital }: { edital: any }) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-1 dark:bg-surface-dark-1 border border-border-color dark:border-border-dark rounded-md">
      <div>
        <p className="font-semibold text-content-main dark:text-content-main-dark">{edital.nome}</p>
        <p className="text-sm text-content-secondary dark:text-content-secondary-dark">Próxima etapa: Relatório Parcial</p>
      </div>
      <Button variant="secondary">Ver Relatórios →</Button>
    </div>
  );
} 