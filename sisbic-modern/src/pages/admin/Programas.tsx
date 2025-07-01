import React, { useState, useMemo } from 'react';
import { useProgramas } from '../../hooks/useProgramas';
import { Search, MoreHorizontal, Grid, List, Plus, BookOpen } from 'lucide-react';
import Button from '../../components/ui/Button';

const Programas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { programas, loading } = useProgramas();

    const filteredProgramas = useMemo(() => {
        if (!programas) return [];
        return programas.filter(p =>
            p.PRO_Descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.PRO_Sigla.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [programas, searchTerm]);

  if (loading) {
    return (
            <div className="flex flex-col h-full p-8 space-y-8 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="w-1/3 h-8 bg-surface-1 dark:bg-surface-dark-1 rounded"></div>
                    <div className="w-32 h-10 bg-surface-1 dark:bg-surface-dark-1 rounded-lg"></div>
              </div>
                <div className="h-12 bg-surface-1 dark:bg-surface-dark-1 rounded w-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-32 bg-surface-1 dark:bg-surface-dark-1 rounded-lg"></div>
            ))}
        </div>
      </div>
    );
  }

  return (
        <div className="flex flex-col h-full p-8 space-y-8">
            <div className="flex justify-between items-center">
          <div>
                    <h1 className="text-3xl font-semibold text-content-main dark:text-content-main-dark mb-1">
              Programas
            </h1>
                    <p className="text-content-secondary dark:text-content-secondary-dark">
                        Gerencie os programas de bolsas de pesquisa e extensão.
            </p>
          </div>
                <Button icon={Plus}>Novo Programa</Button>
        </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-grow max-w-lg">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-content-secondary dark:text-content-secondary-dark w-5 h-5" />
              <input
                type="text"
                        placeholder="Buscar por nome ou sigla..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-surface-1 dark:bg-surface-dark-1 border-transparent rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
              />
            </div>
                <div className="flex items-center bg-surface-1 dark:bg-surface-dark-1 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${ viewMode === 'grid' ? 'bg-surface-0 dark:bg-border-dark text-brand-primary dark:text-brand-primary-dark shadow-sm' : 'text-content-secondary hover:text-content-main' }`}
              >
                        <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${ viewMode === 'list' ? 'bg-surface-0 dark:bg-border-dark text-brand-primary dark:text-brand-primary-dark shadow-sm' : 'text-content-secondary hover:text-content-main' }`}
              >
                        <List className="w-5 h-5" />
            </button>
          </div>
        </div>

            {filteredProgramas.length === 0 && !loading ? (
                <div className="text-center py-20">
                    <p className="text-lg text-content-secondary dark:text-content-secondary-dark">
                        Nenhum programa encontrado.
          </p>
        </div>
            ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProgramas.map((programa) => (
                        <div key={programa.PRO_Codigo} className="bg-surface-1 dark:bg-surface-dark-1 rounded-lg p-5 group flex flex-col justify-between h-40">
                <div>
                                <h3 className="text-base font-semibold text-content-main dark:text-content-main-dark mb-1 truncate">
                    {programa.PRO_Descricao}
                  </h3>
                                <p className="text-sm text-content-secondary dark:text-content-secondary-dark">
                    {programa.PRO_Sigla}
                  </p>
                </div>
                            <div className="flex justify-end items-center">
                                <button className="p-2 rounded-lg hover:bg-surface-0 dark:hover:bg-border-dark opacity-0 group-hover:opacity-100 transition-all duration-200">
                                    <MoreHorizontal className="w-5 h-5 text-content-secondary" />
                                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
                 <div className="bg-surface-1 dark:bg-surface-dark-1 rounded-lg overflow-hidden">
            <table className="w-full">
                        <thead className="border-b border-border-color dark:border-border-dark">
                <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-content-secondary dark:text-content-secondary-dark uppercase tracking-wider">Programa</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-content-secondary dark:text-content-secondary-dark uppercase tracking-wider">Sigla</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-content-secondary dark:text-content-secondary-dark uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
                        <tbody className="divide-y divide-border-color/50 dark:divide-border-dark/50">
                            {filteredProgramas.map((programa) => (
                                <tr key={programa.PRO_Codigo} className="hover:bg-surface-0 dark:hover:bg-border-dark/20 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary dark:text-brand-primary-dark">
                                                <BookOpen className="w-5 h-5" />
                        </div>
                                            <p className="font-medium text-content-main dark:text-content-main-dark">{programa.PRO_Descricao}</p>
                      </div>
                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-content-main dark:text-content-main-dark">{programa.PRO_Sigla}</span>
                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 rounded-lg hover:bg-surface-0 dark:hover:bg-border-dark transition-colors duration-150" title="Mais opções">
                                            <MoreHorizontal className="w-5 h-5 text-content-secondary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}
    </div>
  );
};

export default Programas; 