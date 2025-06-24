import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ChevronDown, MoreVertical, Edit, Trash2, Eye, GraduationCap, Calendar, Award, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { usePeriodosProgramas } from '../../hooks/usePeriodosProgramas';
import { useProgramas } from '../../hooks/useProgramas';
import { useStatus } from '../../hooks/useStatus';
import { PeriodoPrograma } from '../../types/programa';
import Select, { SelectOption } from '../../components/ui/Select';

const Programas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const {
    periodos,
    loading: loadingPeriodos,
    error: errorPeriodos,
    buscarPeriodos,
    deletarPeriodo
  } = usePeriodosProgramas();

  const { programas, loading: loadingProgramas, buscarProgramas } = useProgramas();
  const { status: statusList, loading: loadingStatus, buscarStatus } = useStatus();

  useEffect(() => {
    buscarProgramas();
    buscarStatus();
  }, [buscarProgramas, buscarStatus]);
  
  useEffect(() => {
      buscarPeriodos({ tipo: filterType, status: filterStatus });
  }, [filterType, filterStatus, buscarPeriodos]);

  const filteredPeriodos = periodos.filter(periodo => {
      const searchTermLower = searchTerm.toLowerCase();
      const programaText = (periodo.PRO_Descricao || '').toLowerCase();

      return (periodo.PEP_Sigla && periodo.PEP_Sigla.toLowerCase().includes(searchTermLower)) ||
             (periodo.PEP_Descricao && periodo.PEP_Descricao.toLowerCase().includes(searchTermLower)) ||
             (programaText.includes(searchTermLower));
  });

  const programaOptions: SelectOption[] = [
      { value: 'all', label: 'Todos os Tipos' },
      ...programas.map(p => ({ value: p.PRO_Codigo, label: p.PRO_Sigla }))
  ];

  const statusOptions: SelectOption[] = [
      { value: 'all', label: 'Todos os Status' },
      ...statusList.map(s => ({ value: s.PPS_Codigo, label: s.PPS_Descricao }))
  ];

  const getStatusColor = (statusId: number) => {
    const statusObj = statusList.find(s => s.PPS_Codigo === statusId);
    if (!statusObj) return 'text-ufba-gray-500';
    switch (statusObj.PPS_Descricao) {
      case 'Inscrições Abertas': return 'text-ufba-success';
      case 'Em Avaliação': return 'text-ufba-warning';
      case 'Concluído': return 'text-ufba-gray-500';
      case 'Cancelado': return 'text-ufba-danger';
      case 'Em Elaboração': return 'text-ufba-blue';
      default: return 'text-ufba-gray-500';
    }
  };
  
  const getStatusBg = (statusId: number) => {
    const statusObj = statusList.find(s => s.PPS_Codigo === statusId);
    if (!statusObj) return 'bg-ufba-gray-500/10';
    switch (statusObj.PPS_Descricao) {
      case 'Inscrições Abertas': return 'bg-ufba-success/10';
      case 'Em Avaliação': return 'bg-ufba-warning/10';
      case 'Concluído': return 'bg-ufba-gray-500/10';
      case 'Cancelado': return 'bg-ufba-danger/10';
      case 'Em Elaboração': return 'bg-ufba-blue/10';
      default: return 'bg-ufba-gray-500/10';
    }
  };

  const getStatusText = (statusId: number) => {
    return statusList.find(s => s.PPS_Codigo === statusId)?.PPS_Descricao || 'Desconhecido';
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este edital?')) {
      await deletarPeriodo(id);
    }
  };

  const loading = loadingPeriodos || loadingProgramas || loadingStatus;
  const error = errorPeriodos;

  if (loading) {
    return (
      <Card className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-ufba-blue border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-text-secondary">Carregando editais...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-12 bg-ufba-danger/10">
        <AlertCircle className="w-16 h-16 text-ufba-danger mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-ufba-danger mb-2">
          Erro ao carregar editais
        </h3>
        <p className="text-text-secondary mb-4">
          {error}
        </p>
        <Button variant="primary" icon={Plus} onClick={() => buscarPeriodos()}>
          Tentar Novamente
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Editais</h1>
          <p className="text-text-secondary mt-1">Gerenciamento de editais de iniciação científica</p>
        </div>
        <Button variant="primary" icon={Plus}>Novo Edital</Button>
      </div>

      {/* Filters */}
      <Card className="relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Buscar editais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 text-text-primary placeholder-text-tertiary border-none focus:ring-2 focus:ring-ufba-blue-light transition"
            />
          </div>
          <Select 
            options={programaOptions}
              value={filterType}
            onChange={(value) => setFilterType(String(value))}
            placeholder="Todos os Tipos"
          />
          <Select
            options={statusOptions}
              value={filterStatus}
            onChange={(value) => setFilterStatus(String(value))}
            placeholder="Todos os Status"
          />
        </div>
      </Card>

      {/* Editais Grid */}
      <div className="max-w-6xl mx-auto mt-6">
        <div className="rounded-2xl shadow-xl bg-white/60 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-black/30">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 w-20 text-left font-semibold tracking-wide text-gray-700 dark:text-gray-200 uppercase bg-white/40 dark:bg-black/40 rounded-tl-2xl">Sigla</th>
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-gray-700 dark:text-gray-200 uppercase bg-white/40 dark:bg-black/40">Descrição</th>
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-gray-700 dark:text-gray-200 uppercase bg-white/40 dark:bg-black/40">Programa</th>
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-gray-700 dark:text-gray-200 uppercase bg-white/40 dark:bg-black/40">Início</th>
                <th className="px-4 py-3 text-left font-semibold tracking-wide text-gray-700 dark:text-gray-200 uppercase bg-white/40 dark:bg-black/40">Fim</th>
                <th className="px-4 py-3 text-center font-semibold tracking-wide text-gray-700 dark:text-gray-200 uppercase bg-white/40 dark:bg-black/40 rounded-tr-2xl">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeriodos.map((periodo, idx) => (
                <tr key={periodo.PEP_Codigo} className={idx % 2 === 0 ? "bg-white/40 dark:bg-black/20" : "bg-white/10 dark:bg-black/10"}>
                  <td className="px-4 py-3 w-20 break-words text-left font-medium text-gray-900 dark:text-gray-100">{periodo.PEP_Sigla}</td>
                  <td className="px-4 py-3 break-words max-w-xs text-left text-gray-900 dark:text-gray-100">{periodo.PEP_Descricao}</td>
                  <td className="px-4 py-3 break-words max-w-xs text-left text-gray-900 dark:text-gray-100">{periodo.PRO_Descricao || 'Desconhecido'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-gray-100">{new Date(periodo.PEP_DtInicio).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-gray-100">{new Date(periodo.PEP_DtFim).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center flex items-center justify-center space-x-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ufba-blue/10 transition">
                      <Eye className="w-4 h-4 text-ufba-blue" />
                    </button>
                    <Link to={`/editais/${periodo.PEP_Codigo}/configurar`}>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ufba-gold/10 transition">
                        <Edit className="w-4 h-4 text-ufba-gold" />
                      </button>
                    </Link>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ufba-danger/10 transition"
                      onClick={() => handleDelete(periodo.PEP_Codigo)}
                    >
                      <Trash2 className="w-4 h-4 text-ufba-danger" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredPeriodos.length === 0 && !loading && (
        <Card className="text-center py-12">
          <GraduationCap className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Nenhum edital encontrado
          </h3>
          <p className="text-text-secondary mb-4">
            Tente ajustar os filtros ou criar um novo edital
          </p>
          <Button variant="primary" icon={Plus}>
            Criar Edital
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Programas; 