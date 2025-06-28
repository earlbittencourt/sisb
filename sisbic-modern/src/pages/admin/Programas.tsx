import React, { useState } from 'react';
import { BookOpen, Users, TrendingUp, Search, Grid, List, Plus, MoreHorizontal } from 'lucide-react';
import DashboardCard from '../../components/ui/DashboardCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useProgramas } from '../../hooks/useProgramas';

const Programas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { programas, loading } = useProgramas();

  // Calcular métricas
  const totalProgramas = programas?.length || 0;
  const ativos = programas?.filter(p => p.status?.toLowerCase().includes('ativo')).length || 0;
  const inativos = programas?.filter(p => p.status?.toLowerCase().includes('inativo')).length || 0;

  // Filtrar programas
  const filteredProgramas = programas?.filter(programa => {
    const matchesSearch = programa.PRO_Descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programa.PRO_Sigla?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  if (loading) {
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
    <div className="content-area">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Programas
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Gerencie os programas de bolsas da UFBA
            </p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total de Programas"
            value={totalProgramas.toString()}
            icon={BookOpen}
            trend={{ value: "+3.2%", direction: 'up' }}
          />
          <DashboardCard
            title="Programas Ativos"
            value={ativos.toString()}
            icon={TrendingUp}
            trend={{ value: "+8.5%", direction: 'up' }}
          />
          <DashboardCard
            title="Programas Inativos"
            value={inativos.toString()}
            icon={Users}
            trend={{ value: "-2.1%", direction: 'down' }}
          />
          <DashboardCard
            title="Taxa de Ativação"
            value={`${totalProgramas > 0 ? Math.round((ativos / totalProgramas) * 100) : 0}%`}
            icon={TrendingUp}
            trend={{ value: "+5.7%", direction: 'up' }}
          />
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar programas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-150 focus-ring-light ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-neutral-600 text-primary dark:text-primary-light shadow-sm border border-neutral-200 dark:border-neutral-500'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600'
                }`}
                aria-label="Visualização em grade"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-150 focus-ring-light ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-neutral-600 text-primary dark:text-primary-light shadow-sm border border-neutral-200 dark:border-neutral-500'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600'
                }`}
                aria-label="Visualização em lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* New Programa Button */}
            <button className="btn-primary inline-flex items-center gap-2 px-4 py-2.5">
              <Plus className="w-4 h-4" />
              Novo Programa
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {filteredProgramas.length} programas encontrados
          </p>
        </div>
      </div>

      {/* Programs Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProgramas.map((programa) => (
            <div key={programa.PRO_Codigo} className="bg-neutral-50 dark:bg-neutral-800 shadow-elite rounded-lg p-6 transition-all duration-200 hover:shadow-subtle-lg group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                    {programa.PRO_Descricao}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {programa.PRO_Sigla}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <StatusBadge 
                    status={programa.status || 'Indisponível'} 
                    size="sm" 
                  />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    ID: {programa.PRO_Codigo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-elite overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Programa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Sigla
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-700/50">
                {filteredProgramas.map((programa, index) => (
                  <tr 
                    key={programa.PRO_Codigo} 
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800 dark:text-neutral-100">
                            {programa.PRO_Descricao}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className="text-sm text-neutral-900 dark:text-neutral-100">
                        {programa.PRO_Sigla}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <StatusBadge status={programa.status || 'Indisponível'} size="sm" />
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {programa.PRO_Codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right align-top">
                      <button 
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-150"
                        aria-label="Ações do programa"
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
        </div>
      )}
    </div>
  );
};

export default Programas; 