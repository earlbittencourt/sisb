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
import { HeroEditalCard } from '../../components/cards/HeroEditalCard';
import { ActiveEditalListItem } from '../../components/cards/ActiveEditalListItem';
import { SectionHeader } from '../../components/ui/SectionHeader';

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

export default function EditaisPage() {
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

  const editalEmInscricao = paginatedData.find(e => e.status === 'Inscrições Abertas');
  const editaisEmAndamento = paginatedData.filter(e => e.status === 'Em Andamento');

  return (
    <div className="space-y-12">
      {/* Zona 1: A Estrela do Show */}
      {editalEmInscricao && <HeroEditalCard edital={editalEmInscricao} />}

      {/* Zona 2: A Próxima Fila */}
      {editaisEmAndamento.length > 0 && (
        <div>
          <SectionHeader title="Editais em Andamento" />
          <div className="space-y-4">
            {editaisEmAndamento.map(edital => (
              <ActiveEditalListItem key={edital.PEP_Codigo} edital={edital} />
            ))}
          </div>
        </div>
      )}

      {/* Zona 3: O Arquivo */}
      <div className="text-center">
        <a href="/editais/arquivo" className="text-content-secondary dark:text-content-secondary-dark hover:text-brand-primary">
          Ver todos os editais anteriores →
        </a>
      </div>
    </div>
  );
} 