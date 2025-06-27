import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, Search, Grid, List, Plus, MoreHorizontal, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import DashboardCard from '../../components/ui/DashboardCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { usePeriodosProgramas } from '../../hooks/usePeriodosProgramas';
import FiltersPanel from '../../components/ui/FiltersPanel';
import { useProgramas } from '../../hooks/useProgramas';
import { useStatus } from '../../hooks/useStatus';

const ITEMS_PER_PAGE = 10;

const Editais = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filtros, setFiltros] = useState<{ tipos: string[]; status: string[] }>({ tipos: [], status: [] });
  const [sortBy, setSortBy] = useState<string>('PEP_Descricao');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { periodos, loading: loadingPeriodos } = usePeriodosProgramas();
  const { programas } = useProgramas();
  const { status: statusList } = useStatus();

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
  const emAndamento = periodos?.filter(e => isStatusEmAndamento(e.PPS_Descricao)).length || 0;
  const concluidos = periodos?.filter(e => isStatusConcluido(e.PPS_Descricao)).length || 0;
  const inscricoesAbertas = periodos?.filter(e => isStatusInscricoesAbertas(e.PPS_Descricao)).length || 0;

  // Lógica de filtros
  const handleFiltroChange = (campo: 'tipos' | 'status', valor: string, checked: boolean) => {
    setFiltros((prev) => {
      const arr = prev[campo];
      return {
        ...prev,
        [campo]: checked ? [...arr, valor] : arr.filter((v) => v !== valor),
      };
    });
  };
  const handleLimparFiltros = () => setFiltros({ tipos: [], status: [] });

  // Filtros ativos para exibir no painel
  const activeFilters = [
    ...filtros.tipos.map((id) => {
      const p = programas.find((p) => p.PRO_Codigo?.toString() === id);
      return p ? `Programa: ${p.PRO_Sigla}` : null;
    }).filter(Boolean),
    ...filtros.status.map((id) => {
      const s = statusList.find((s) => s.PPS_Codigo?.toString() === id);
      return s ? `Status: ${s.PPS_Descricao}` : null;
    }).filter(Boolean),
  ];
  const handleRemoveFiltro = (filtro: string) => {
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

  // Filtrar editais
  const filteredEditais = periodos?.filter(edital => {
    const matchesSearch = edital.PEP_Descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edital.PEP_Sigla?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo =
      filtros.tipos.length === 0 ||
      filtros.tipos.includes(edital.PEP_Codigo_PRO?.toString()) ||
      filtros.tipos.includes(edital.PRO_Codigo?.toString());
    const matchesStatus =
      filtros.status.length === 0 ||
      filtros.status.includes(edital.PEP_Codigo_PPS?.toString());
    return matchesSearch && matchesTipo && matchesStatus;
  }) || [];

  // Ordenação
  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDirection('asc');
    }
  };
  const sortedEditais = [...filteredEditais].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    switch (sortBy) {
      case 'PEP_Descricao':
        aValue = a.PEP_Descricao;
        bValue = b.PEP_Descricao;
        break;
      case 'PRO_Descricao':
        aValue = a.PRO_Descricao;
        bValue = b.PRO_Descricao;
        break;
      case 'PPS_Descricao':
        aValue = a.PPS_Descricao || '';
        bValue = b.PPS_Descricao || '';
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
    if (!aValue) return 1;
    if (!bValue) return -1;
    // Datas
    if (sortBy === 'PEP_DtInicio' || sortBy === 'PEP_DtFim') {
      return sortDirection === 'asc'
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }
    // Strings
    return sortDirection === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  // Paginação
  const totalPages = Math.ceil(sortedEditais.length / ITEMS_PER_PAGE);
  const paginatedEditais = sortedEditais.slice(
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
      <div className="layout-container">
        <div className="main-content">
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
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container">
      <div className="main-content">
        <div className="content-area">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  Editais
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Gerencie os editais de bolsas da UFBA
                </p>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                title="Total de Editais"
                value={totalEditais.toString()}
                icon={FileText}
                trend={{ value: "+5.2%", direction: 'up' }}
              />
              <DashboardCard
                title="Em Andamento"
                value={emAndamento.toString()}
                icon={Clock}
                trend={{ value: "+12.5%", direction: 'up' }}
              />
              <DashboardCard
                title="Inscrições Abertas"
                value={inscricoesAbertas.toString()}
                icon={Search}
                trend={{ value: "+8.1%", direction: 'up' }}
              />
              <DashboardCard
                title="Concluídos"
                value={concluidos.toString()}
                icon={CheckCircle}
                trend={{ value: "+3.7%", direction: 'up' }}
              />
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar editais..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg 
                            focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200
                            hover:border-neutral-300 dark:hover:border-neutral-600
                            placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="btn-secondary inline-flex items-center gap-2 px-4 py-2.5 hover:scale-105 transition-transform duration-200"
                  onClick={() => setIsFiltersOpen(true)}
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
                <button className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 hover:scale-105 transition-transform duration-200">
                  <Plus className="w-4 h-4" />
                  Novo Edital
                </button>
              </div>
            </div>
            <FiltersPanel
              isOpen={isFiltersOpen}
              onClose={() => setIsFiltersOpen(false)}
              programas={programas}
              statusList={statusList}
              filtros={filtros}
              onFiltroChange={handleFiltroChange}
              activeFilters={activeFilters as string[]}
              onRemoveFiltro={handleRemoveFiltro}
              className="z-[60]"
              onClearFilters={handleLimparFiltros}
            />

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {filteredEditais.length} editais encontrados
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-elite overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer select-none group hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors duration-200"
                      onClick={() => handleSort('PEP_Descricao')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Edital</span>
                        <div className="flex items-center gap-1">
                          {sortBy === 'PEP_Descricao' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-primary" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-primary" />
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
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer select-none group hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors duration-200"
                      onClick={() => handleSort('PRO_Descricao')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Programa</span>
                        <div className="flex items-center gap-1">
                          {sortBy === 'PRO_Descricao' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-primary" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-primary" />
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
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer select-none group hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors duration-200"
                      onClick={() => handleSort('PPS_Descricao')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Status</span>
                        <div className="flex items-center gap-1">
                          {sortBy === 'PPS_Descricao' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-primary" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-primary" />
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
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer select-none group hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors duration-200"
                      onClick={() => handleSort('PEP_DtInicio')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Início</span>
                        <div className="flex items-center gap-1">
                          {sortBy === 'PEP_DtInicio' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-primary" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-primary" />
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
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer select-none group hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors duration-200"
                      onClick={() => handleSort('PEP_DtFim')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Fim</span>
                        <div className="flex items-center gap-1">
                          {sortBy === 'PEP_DtFim' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-primary" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-primary" />
                            )
                          ) : (
                            <div className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <ChevronUp className="w-4 h-4 text-neutral-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-700/50">
                  {paginatedEditais.map((edital, index) => (
                    <tr 
                      key={edital.PEP_Codigo} 
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 align-top">
                        <div>
                          <p className="font-medium text-neutral-800 dark:text-neutral-100 hover:text-primary dark:hover:text-primary-light transition-colors cursor-pointer">
                            {edital.PEP_Descricao}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {edital.PEP_Sigla}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div>
                          <p className="font-medium text-neutral-800 dark:text-neutral-100">
                            {edital.PRO_Descricao}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <StatusBadge status={edital.PPS_Descricao || 'Indisponível'} size="sm" />
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">
                          {edital.PEP_DtInicio ? new Date(edital.PEP_DtInicio).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">
                          {edital.PEP_DtFim ? new Date(edital.PEP_DtFim).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right align-top">
                        <button 
                          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-150"
                          aria-label="Ações do edital"
                          title="Mais opções"
                        >
                          <MoreHorizontal className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Paginação */}
            {totalPages > 1 && (
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
                        ? 'bg-primary text-white shadow-subtle'
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editais; 