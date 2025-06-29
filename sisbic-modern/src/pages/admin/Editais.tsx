import React, { useState, useEffect, Fragment } from 'react';
import { FileText, Clock, CheckCircle, Plus, MoreHorizontal, Filter, ChevronUp, ChevronDown, Eye, Edit3, Trash2 } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { usePeriodosProgramas } from '../../hooks/usePeriodosProgramas';
import { useProgramas } from '../../hooks/useProgramas';
import { useStatus } from '../../hooks/useStatus';
import { QueryBuilder } from '../../components/ui/QueryBuilder';
import StatusBadge from '../../components/ui/StatusBadge';
import FiltersPanel from '../../components/ui/FiltersPanel';
import DashboardCard from '../../components/ui/DashboardCard';
import Button from '../../components/ui/Button';

const ITEMS_PER_PAGE = 10;

const Editais = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filtros, setFiltros] = useState<{ tipos: string[]; status: string[] }>({ tipos: [], status: [] });
  const [queryFilters, setQueryFilters] = useState<Array<{ id: string; label: string; condition: string; value: string }>>([]);
  const [sortBy, setSortBy] = useState<string>('PEP_DtInicio');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { periodos, loading: loadingPeriodos } = usePeriodosProgramas();
  const { programas } = useProgramas();
  const { status: statusList } = useStatus();
  const navigate = useNavigate();

  // Função para verificar se um status indica que o edital está concluído
  const isStatusConcluido = (status: string | undefined): boolean => {
    if (!status) return false;
    const statusLower = status.toLowerCase();
    const keywordsConcluido = ['concluído', 'concluido', 'finalizado', 'encerrado', 'terminado', 'completo', 'finalizado'];
    return keywordsConcluido.some(keyword => statusLower.includes(keyword));
  };

  // Função para verificar se um status indica que o edital está em andamento
  const isStatusEmAndamento = (status: string | undefined): boolean => {
    if (!status) return false;
    const statusLower = status.toLowerCase();
    const keywordsAndamento = ['andamento', 'em andamento', 'ativo', 'vigente', 'aberto'];
    return keywordsAndamento.some(keyword => statusLower.includes(keyword));
  };

  // Função para verificar se um status indica que as inscrições estão abertas
  const isStatusInscricoesAbertas = (status: string | undefined): boolean => {
    if (!status) return false;
    const statusLower = status.toLowerCase();
    const keywordsInscricoes = ['inscrições', 'inscricoes', 'abertas', 'aberto', 'recebendo'];
    return keywordsInscricoes.some(keyword => statusLower.includes(keyword));
  };

  // Calcular métricas
  const totalEditais = periodos?.length || 0;
  const emAndamento = periodos?.filter(e => {
    const status = statusList.find(s => s.PPS_Codigo === e.PEP_Codigo_PPS)?.PPS_Descricao?.toLowerCase() || '';
    return ['em andamento', 'andamento', 'ativo', 'vigente', 'aberto'].some(s => status.includes(s));
  }).length || 0;
  const concluidos = periodos?.filter(e => {
    const status = statusList.find(s => s.PPS_Codigo === e.PEP_Codigo_PPS)?.PPS_Descricao?.toLowerCase() || '';
    return ['concluído', 'concluido', 'finalizado', 'encerrado', 'terminado', 'completo'].some(s => status.includes(s));
  }).length || 0;
  const inscricoesAbertas = periodos?.filter(e => {
    const status = statusList.find(s => s.PPS_Codigo === e.PEP_Codigo_PPS)?.PPS_Descricao?.toLowerCase() || '';
    return ['inscrições', 'inscricoes', 'abertas', 'aberto', 'recebendo'].some(s => status.includes(s));
  }).length || 0;

  // Lógica de filtros
  const handleFiltroChange = (campo: 'tipos' | 'status', valor: string, checked: boolean) => {
    setFiltros(prev => {
      const novosFiltros = { ...prev };
      if (checked) {
        novosFiltros[campo] = [...prev[campo], valor];
      } else {
        novosFiltros[campo] = prev[campo].filter(v => v !== valor);
      }
      return novosFiltros;
    });
  };

  // Função para remover um filtro
  const handleRemoveFiltro = (filtro: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filtro));
    if (filtro.startsWith('Programa: ')) {
      const sigla = filtro.replace('Programa: ', '');
      const p = programas.find((p) => p.PRO_Sigla === sigla);
      if (p) setFiltros((prev) => ({ ...prev, tipos: prev.tipos.filter((id) => id !== p.PRO_Codigo.toString()) }));
    } else if (filtro.startsWith('Status: ')) {
      const desc = filtro.replace('Status: ', '');
      const s = statusList.find((s) => s.PPS_Descricao === desc);
      if (s) setFiltros((prev) => ({ ...prev, status: prev.status.filter((id) => id !== s.PPS_Codigo.toString()) }));
    }
  };

  // Função para limpar todos os filtros
  const handleLimparFiltros = () => {
    setFiltros({ tipos: [], status: [] });
    setActiveFilters([]);
  };

  // Atualizar activeFilters quando os filtros mudam
  useEffect(() => {
    const newActiveFilters = [
        ...filtros.tipos.map(id => {
            const programa = programas.find(p => p.PRO_Codigo.toString() === id);
            return programa ? `Programa: ${programa.PRO_Sigla}` : null;
        }).filter((f): f is string => f !== null),
        ...filtros.status.map(id => {
            const status = statusList.find(s => s.PPS_Codigo.toString() === id);
            return status ? `Status: ${status.PPS_Descricao}` : null;
        }).filter((f): f is string => f !== null)
    ];

    setActiveFilters(newActiveFilters);
  }, [filtros, programas, statusList]);

  // Lógica de ordenação
  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDirection('asc');
    }
  };

  // Filtrar editais
  const editaisFiltrados = periodos?.filter(edital => {
    const matchesTipo =
      filtros.tipos.length === 0 ||
      filtros.tipos.includes(edital.PEP_Codigo_PRO?.toString());
    const matchesStatus =
      filtros.status.length === 0 ||
      filtros.status.includes(edital.PEP_Codigo_PPS?.toString());

    const matchesSearch = searchTerm
      ? edital.PEP_Descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edital.PEP_Sigla.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Aplicar filtros do QueryBuilder
    const matchesQueryFilters = queryFilters.every(filter => {
      const programa = programas.find(p => p.PRO_Codigo === edital.PEP_Codigo_PRO);
      const status = statusList.find(s => s.PPS_Codigo === edital.PEP_Codigo_PPS);
      
      switch (filter.label) {
        case 'Status':
          if (!status) return false;
          const statusValue = status.PPS_Descricao.toLowerCase();
          const filterValues = filter.value.split(',').map(v => v.trim().toLowerCase());
          switch (filter.condition) {
            case 'é':
              return filterValues.includes(statusValue);
            case 'não é':
              return !filterValues.includes(statusValue);
            case 'contém':
              return filterValues.some(val => statusValue.includes(val));
            case 'não contém':
              return filterValues.every(val => !statusValue.includes(val));
            default:
              return true;
          }
        case 'Programa':
          if (!programa) return false;
          const programaValue = programa.PRO_Sigla.toLowerCase();
          const programaFilterValue = filter.value.toLowerCase();
          switch (filter.condition) {
            case 'é': return programaValue === programaFilterValue;
            case 'não é': return programaValue !== programaFilterValue;
            case 'contém': return programaValue.includes(programaFilterValue);
            case 'não contém': return !programaValue.includes(programaFilterValue);
            default: return true;
          }
        case 'Título':
          const tituloValue = edital.PEP_Descricao.toLowerCase();
          const tituloFilterValue = filter.value.toLowerCase();
          switch (filter.condition) {
            case 'é': return tituloValue === tituloFilterValue;
            case 'não é': return tituloValue !== tituloFilterValue;
            case 'contém': return tituloValue.includes(tituloFilterValue);
            case 'não contém': return !tituloValue.includes(tituloFilterValue);
            default: return true;
          }
        case 'Data de Início':
        case 'Data de Fim': {
          const field = filter.label === 'Data de Início' ? edital.PEP_DtInicio : edital.PEP_DtFim;
          const filterValues = filter.value.split(',').map(v => v.trim());
          const editalDate = new Date(field).setHours(0,0,0,0);
          if (filter.condition === 'é igual') {
            const filterDate = new Date(filterValues[0]).setHours(0,0,0,0);
            return editalDate === filterDate;
          }
          if (filter.condition === 'maior que') {
            const filterDate = new Date(filterValues[0]).setHours(0,0,0,0);
            return editalDate > filterDate;
          }
          if (filter.condition === 'menor que') {
            const filterDate = new Date(filterValues[0]).setHours(0,0,0,0);
            return editalDate < filterDate;
          }
          if (filter.condition === 'entre') {
            const start = new Date(filterValues[0]).setHours(0,0,0,0);
            const end = new Date(filterValues[1]).setHours(0,0,0,0);
            return editalDate >= start && editalDate <= end;
          }
          return true;
        }
        default:
          return true;
      }
    });

    return matchesTipo && matchesStatus && matchesSearch && matchesQueryFilters;
  });

  // Ordenar editais
  const editaisOrdenados = [...(editaisFiltrados || [])].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'PEP_Descricao':
        aValue = a.PEP_Descricao;
        bValue = b.PEP_Descricao;
        break;
      case 'PEP_Sigla':
        aValue = a.PEP_Sigla;
        bValue = b.PEP_Sigla;
        break;
      case 'PEP_DtInicio':
        aValue = a.PEP_DtInicio;
        bValue = b.PEP_DtInicio;
        break;
      case 'PEP_DtFim':
        aValue = a.PEP_DtFim;
        bValue = b.PEP_DtFim;
        break;
      default:
        aValue = a.PEP_Descricao;
        bValue = b.PEP_Descricao;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginação
  const totalPages = Math.ceil(editaisOrdenados.length / ITEMS_PER_PAGE);
  const paginatedEditais = editaisOrdenados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Resetar para página 1 ao buscar
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loadingPeriodos) {
    return (
      <div className="content-area">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container bg-gray-50 dark:bg-gray-900">
      <div className="main-content">
        <div className="content-area">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h1 className="text-3xl font-bold text-neutral-darker dark:text-slate-100 mb-2">
                  Editais
                </h1>
                <p className="text-neutral-600 dark:text-slate-400">
                  Gerencie os editais de bolsas da UFBA
                </p>
              </div>
            </div>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <DashboardCard
                title="Inscrições Abertas"
                value={inscricoesAbertas.toString()}
                icon={FileText}
                trend={{ value: '+8.1%', direction: 'up' }}
                className="bg-white dark:bg-slate-800"
              />
              <DashboardCard
                title="Em Andamento"
                value={emAndamento.toString()}
                icon={Clock}
                trend={{ value: '+12.5%', direction: 'up' }}
                className="bg-white dark:bg-slate-800"
              />
              <DashboardCard
                title="Total de Editais"
                value={totalEditais.toString()}
                icon={FileText}
                trend={{ value: '+5.2%', direction: 'up' }}
                className="bg-white dark:bg-slate-800"
              />
              <DashboardCard
                title="Concluídos"
                value={concluidos.toString()}
                icon={CheckCircle}
                trend={{ value: '+3.7%', direction: 'up' }}
                className="bg-white dark:bg-slate-800"
              />
            </div>
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="w-full">
                <QueryBuilder 
                  searchText={searchTerm}
                  onSearchChange={setSearchTerm}
                  filters={queryFilters}
                  onFiltersChange={setQueryFilters}
                  statusOptions={statusList.map(s => s.PPS_Descricao)}
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => navigate('/editais/novo')}
                  variant="primary"
                  size="md"
                  className="flex items-center gap-2 h-12 rounded-lg"
                  icon={Plus}
                >
                  Novo Edital
                </Button>
              </div>
            </div>
            <FiltersPanel
              isOpen={isFiltersOpen}
              onClose={() => setIsFiltersOpen(false)}
              programas={programas}
              statusList={statusList}
              filtros={filtros}
              onFiltroChange={handleFiltroChange}
              activeFilters={activeFilters}
              onRemoveFiltro={handleRemoveFiltro}
              onClearFilters={handleLimparFiltros}
              className="z-[60]"
            />
          </div>
          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden border border-gray-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-slate-700">
                <thead className="bg-neutral-50 dark:bg-slate-800">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none group hover:bg-neutral-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
                      onClick={() => handleSort('PEP_Descricao')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Título</span>
                        <div className="flex items-center gap-1">
                          {sortBy === 'PEP_Descricao' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-primary dark:text-primary-light" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-primary dark:text-primary-light" />
                            )
                          ) : (
                            <div className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <ChevronUp className="w-4 h-4 text-neutral-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none group hover:bg-neutral-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
                      onClick={() => handleSort('PEP_Sigla')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Programa</span>
                        <div className="flex items-center gap-1">
                          {sortBy === 'PEP_Sigla' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-primary dark:text-primary-light" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-primary dark:text-primary-light" />
                            )
                          ) : (
                            <div className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <ChevronUp className="w-4 h-4 text-neutral-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wider min-w-[120px]">
                      Status
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none group hover:bg-neutral-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
                      onClick={() => handleSort('PEP_DtInicio')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Data de Início</span>
                        <div className="flex items-center gap-1">
                          {sortBy === 'PEP_DtInicio' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-primary dark:text-primary-light" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-primary dark:text-primary-light" />
                            )
                          ) : (
                            <div className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <ChevronUp className="w-4 h-4 text-neutral-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none group hover:bg-neutral-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
                      onClick={() => handleSort('PEP_DtFim')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Data de Fim</span>
                        <div className="flex items-center gap-1">
                          {sortBy === 'PEP_DtFim' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-primary dark:text-primary-light" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-primary dark:text-primary-light" />
                            )
                          ) : (
                            <div className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <ChevronUp className="w-4 h-4 text-neutral-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-neutral-200 dark:divide-slate-700">
                  {paginatedEditais.map((edital) => {
                    const programa = programas.find(p => p.PRO_Codigo === edital.PEP_Codigo_PRO);
                    const status = statusList.find(s => s.PPS_Codigo === edital.PEP_Codigo_PPS);
                    
                    return (
                      <tr key={edital.PEP_Codigo} className="hover:bg-neutral-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-col">
                            <button
                              onClick={() => navigate(`/editais/${edital.PEP_Codigo}/configurar`)}
                              className="font-semibold text-primary dark:text-primary-light hover:underline cursor-pointer text-left"
                            >
                              {edital.PEP_Descricao}
                            </button>
                            <span className="text-sm text-neutral-500 dark:text-slate-400">
                              {edital.PEP_Sigla}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className="text-neutral-800 dark:text-slate-100">
                            {programa?.PRO_Sigla || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top min-w-[140px]">
                          <StatusBadge status={status?.PPS_Descricao || 'Indisponível'} size="sm" />
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className="text-sm text-neutral-900 dark:text-slate-100">
                            {new Date(edital.PEP_DtInicio).toLocaleDateString('pt-BR')}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className="text-sm text-neutral-900 dark:text-slate-100">
                            {new Date(edital.PEP_DtFim).toLocaleDateString('pt-BR')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right align-top">
                          <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors">
                              <MoreHorizontal className="w-5 h-5 text-neutral-500 dark:text-slate-400" />
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-neutral-100 dark:divide-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="p-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => navigate(`/editais/${edital.PEP_Codigo}/configurar`)}
                                        className={cn(
                                          'flex items-center px-4 py-2 text-sm rounded-lg w-full text-left',
                                          active
                                            ? 'bg-neutral-100 dark:bg-slate-700 text-neutral-900 dark:text-white'
                                            : 'text-neutral-700 dark:text-slate-300'
                                        )}
                                      >
                                        <Eye className="mr-3 h-5 w-5" />
                                        Visualizar
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => navigate(`/editais/${edital.PEP_Codigo}/editar`)}
                                        className={cn(
                                          'flex items-center px-4 py-2 text-sm rounded-lg w-full text-left',
                                          active
                                            ? 'bg-neutral-100 dark:bg-slate-700 text-neutral-900 dark:text-white'
                                            : 'text-neutral-700 dark:text-slate-300'
                                        )}
                                      >
                                        <Edit3 className="mr-3 h-5 w-5" />
                                        Editar
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => {
                                          // Adicionar lógica para excluir
                                        }}
                                        className={cn(
                                          'flex items-center px-4 py-2 text-sm rounded-lg w-full text-left',
                                          active
                                            ? 'bg-neutral-100 dark:bg-slate-700 text-red-600 dark:text-red-400'
                                            : 'text-red-500 dark:text-red-400'
                                        )}
                                      >
                                        <Trash2 className="mr-3 h-5 w-5" />
                                        Excluir
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Paginação */}
          <div className="flex justify-end items-center gap-2 px-6 py-4">
            <button
              className="px-3 py-1 rounded-lg text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  page === currentPage
                    ? 'bg-primary text-primary-700 shadow-subtle'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded-lg text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editais; 