import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePeriodosProgramas } from '../../hooks/usePeriodosProgramas';
import { useProgramas } from '../../hooks/useProgramas';
import { useStatus } from '../../hooks/useStatus';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { QueryBuilder } from '../../components/ui/QueryBuilder';
import { Filter } from '../../components/ui/FilterPill';
import { PeriodoPrograma } from '../../types/programa';
import DashboardCard from '../../components/ui/DashboardCard';
import { FileText, Clock, CheckCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Mapeamento dos status reais para os nomes dos cards
const statusMap: Record<string, string> = {
  'em inscrições': 'Inscrições Abertas',
  'inscrições abertas': 'Inscrições Abertas',
  'em andamento': 'Em Andamento',
  'concluído': 'Concluídos',
  'concluido': 'Concluídos',
};

function getStatusCardName(status: string) {
  if (!status) return '';
  const normalized = status.trim().toLowerCase();
  return statusMap[normalized] || '';
}

// Função para capitalizar a primeira letra
function capitalize(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Editais() {
  const navigate = useNavigate();
  const { periodos, loading: isLoadingPeriodos } = usePeriodosProgramas();
  const { programas } = useProgramas();
  const { status: statusList } = useStatus();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [queryFilters, setQueryFilters] = useState<Filter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Contagem usando o mapeamento
  let inscricoesAbertas = 0, emAndamento = 0, concluidos = 0;
  const totalEditais = periodos?.length || 0;
  if (periodos && statusList) {
    periodos.forEach(e => {
      const statusObj = statusList.find(s => s.PPS_Codigo === e.PEP_Codigo_PPS);
      const cardName = getStatusCardName(statusObj?.PPS_Descricao || '');
      if (cardName === 'Inscrições Abertas') inscricoesAbertas++;
      if (cardName === 'Em Andamento') emAndamento++;
      if (cardName === 'Concluídos') concluidos++;
    });
  }

  const percent = (count: number) => totalEditais > 0 ? Math.round((count / totalEditais) * 100) : 0;

  const editaisFiltrados = useMemo(() => {
    let editais: PeriodoPrograma[] = periodos ? [...periodos] : [];

    if (searchTerm) {
      editais = editais.filter(edital =>
        edital.PEP_Descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (queryFilters.length > 0) {
      editais = editais.filter(edital => {
        return queryFilters.every(filter => {
          const { label, condition, value } = filter;
          switch (label) {
            case 'Título': {
              const targetValue = edital.PEP_Descricao.toLowerCase();
              const filterValue = String(value).toLowerCase();
              switch (condition) {
                case 'contém': return targetValue.includes(filterValue);
                case 'não contém': return !targetValue.includes(filterValue);
                case 'é': return targetValue === filterValue;
                case 'não é': return targetValue !== filterValue;
                default: return true;
              }
            }
            case 'Programa': {
              const programa = programas.find(p => p.PRO_Codigo === edital.PEP_Codigo_PRO);
              const filterValues = value.split(',');
              if (!programa) return false;
              switch (condition) {
                case 'é': return filterValues.includes(programa.PRO_Sigla);
                case 'não é': return !filterValues.includes(programa.PRO_Sigla);
                default: return true;
              }
            }
            case 'Status': {
              const status = statusList.find(s => s.PPS_Codigo === edital.PEP_Codigo_PPS);
              const filterValues = value.split(',');
              if (!status) return false;
              switch (condition) {
                case 'é': return filterValues.includes(status.PPS_Descricao);
                case 'não é': return !filterValues.includes(status.PPS_Descricao);
                default: return true;
              }
            }
            case 'Data de Início':
            case 'Data de Fim': {
              const targetValue = label === 'Data de Início' ? edital.PEP_DtInicio : edital.PEP_DtFim;
              const date = new Date(targetValue);
              if (isNaN(date.getTime())) return false;
              if (condition === 'entre' && typeof value === 'string' && value.includes(',')) {
                const [start, end] = value.split(',');
                const startDate = new Date(start);
                const endDate = new Date(end);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;
                return date >= startDate && date <= endDate;
              } else if (typeof value === 'string') {
                const filterDate = new Date(value);
                if (isNaN(filterDate.getTime())) return false;
                switch (condition) {
                  case 'é igual': return date.getTime() === filterDate.getTime();
                  case 'maior que': return date > filterDate;
                  case 'menor que': return date < filterDate;
                  default: return false;
                }
              }
              return false;
            }
            default: return true;
          }
        });
      });
    }

    return editais.sort((a, b) => new Date(b.PEP_DtInicio).getTime() - new Date(a.PEP_DtInicio).getTime());
  }, [periodos, searchTerm, queryFilters, programas, statusList]);
  
  const totalPages = Math.ceil(editaisFiltrados.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    return editaisFiltrados
      .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
      .map(edital => {
        const programa = programas.find(p => p.PRO_Codigo === edital.PEP_Codigo_PRO);
        const status = statusList.find(s => s.PPS_Codigo === edital.PEP_Codigo_PPS);
        
        const getStatusChipClass = (statusDesc: string) => {
          const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
          switch (getStatusCardName(statusDesc)) {
            case 'Em Andamento':
            case 'Inscrições Abertas':
              return `${baseClasses} bg-brand-accent/20 text-brand-accent dark:bg-brand-accent-dark/20 dark:text-brand-accent-dark`;
            case 'Concluídos':
              return `${baseClasses} bg-brand-success/20 text-brand-success dark:bg-brand-success-dark/20 dark:text-brand-success-dark`;
            default:
              return `${baseClasses} bg-surface-1 dark:bg-surface-dark-1 text-content-secondary dark:text-content-secondary-dark`;
          }
        };

        return {
          ...edital,
          titulo: edital.PEP_Descricao,
          programa: programa?.PRO_Sigla || 'N/A',
          periodo: `${format(new Date(edital.PEP_DtInicio), 'dd/MM/yyyy', { locale: ptBR })} - ${format(new Date(edital.PEP_DtFim), 'dd/MM/yyyy', { locale: ptBR })}`,
          status: status ? (
            <span className={getStatusChipClass(status.PPS_Descricao) + ' whitespace-nowrap'}>
              {capitalize(status.PPS_Descricao)}
            </span>
          ) : 'N/A',
        };
      });
  }, [editaisFiltrados, programas, statusList, currentPage]);

  const columns = [
    { key: 'titulo', label: 'Título do Edital' },
    { key: 'programa', label: 'Programa' },
    { key: 'periodo', label: 'Período de Inscrição' },
    { key: 'status', label: 'Status', className: 'min-w-[160px] whitespace-nowrap' },
  ];

  const handleRowClick = (row: Record<string, any>) => {
    navigate(`/editais/${row.PEP_Codigo}/configurar`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <header className="mb-8">
        <div className="flex justify-between items-start mb-6">
              <div>
              <h1 className="text-3xl text-content-main dark:text-content-main-dark">Editais</h1>
              <p className="text-content-secondary dark:text-content-secondary-dark mt-1">Gerencie os editais de todos os programas.</p>
            </div>
            <Button onClick={() => navigate('/admin/editais/novo')}>
              Criar Novo Edital
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Inscrições Abertas" value={inscricoesAbertas.toString()} percent={percent(inscricoesAbertas)} icon={FileText} />
          <DashboardCard title="Em Andamento" value={emAndamento.toString()} percent={percent(emAndamento)} icon={Clock} />
          <DashboardCard title="Concluídos" value={concluidos.toString()} percent={percent(concluidos)} icon={CheckCircle} />
          <DashboardCard title="Total de Editais" value={totalEditais.toString()} percent={100} icon={FileText} />
        </div>
      </header>
      
      <div className="flex-grow flex flex-col">
        <div className="mb-4">
          <QueryBuilder
            searchText={searchTerm}
            onSearchChange={setSearchTerm}
            filters={queryFilters}
            onFiltersChange={setQueryFilters}
            statusOptions={statusList.map(s => s.PPS_Descricao)}
              />
            </div>
        
        <div className="flex-1 overflow-auto border border-border-color dark:border-border-dark rounded-lg">
          <DataTable
            columns={columns}
            data={paginatedData}
            isLoading={isLoadingPeriodos}
            onRowClick={handleRowClick}
                />
              </div>

        <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            className="px-4 py-2 text-sm rounded-lg bg-surface-1 dark:bg-surface-dark-1 text-content-main dark:text-content-main-dark hover:bg-border-color dark:hover:bg-border-dark font-medium transition-colors disabled:opacity-50"
            >
              Anterior
            </button>
          <span className="text-sm text-content-secondary flex items-center">{`Página ${currentPage} de ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 text-sm rounded-lg bg-surface-1 dark:bg-surface-dark-1 text-content-main dark:text-content-main-dark hover:bg-border-color dark:hover:bg-border-dark font-medium transition-colors disabled:opacity-50"
            >
              Próxima
            </button>
        </div>
      </div>
    </div>
  );
} 