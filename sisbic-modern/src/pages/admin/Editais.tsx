import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { usePeriodosProgramas } from '../../hooks/usePeriodosProgramas';
import { useProgramas } from '../../hooks/useProgramas';
import { useStatus } from '../../hooks/useStatus';
import { Tabs } from '../../components/ui/Tabs';
import { EditalPowerCard } from '../../components/ui/EditalPowerCard';
import Button from '../../components/ui/Button';
import { QueryBuilder } from '../../components/ui/QueryBuilder';
import { Filter } from '../../components/ui/FilterPill';
import { PeriodoPrograma } from '../../types/programa';
import { CategoriaStatus, categorizarStatus } from '../../types/status';

// Função para capitalizar a primeira letra
function capitalize(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface EditalProcessado extends PeriodoPrograma {
  PRO_Descricao: string;
  PPS_Descricao?: string;
  projetosSubmetidos: number;
  projetosAvaliados: number;
  distribuicaoComite: number;
  evolucaoSubmissoes: { data: string; quantidade: number }[];
}

interface EditaisAgrupados {
  emInscricao: EditalProcessado[];
  emAndamento: EditalProcessado[];
  outros: EditalProcessado[];
}

export function Editais() {
  const navigate = useNavigate();
  const { periodos, loading: isLoadingPeriodos } = usePeriodosProgramas();
  const { programas } = useProgramas();
  const { status: statusList } = useStatus();
  
  // Filtros e busca
  const [searchTerm, setSearchTerm] = React.useState('');
  const [queryFilters, setQueryFilters] = React.useState<Filter[]>([]);

  // Processamento dos editais
  const editaisProcessados = useMemo<EditaisAgrupados>(() => {
    if (!periodos || !statusList || !programas) return { emInscricao: [], emAndamento: [], outros: [] };

    console.log('Status disponíveis:', statusList.map(s => ({ codigo: s.PPS_Codigo, descricao: s.PPS_Descricao })));

    let editais = periodos;

    // Aplicar filtros de busca
    if (searchTerm) {
      editais = editais.filter(edital =>
        edital.PEP_Descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros avançados
    if (queryFilters.length > 0)
      editais = editais.filter(edital => {
        return queryFilters.every(filter => {
          const { label, condition, value } = filter;
          switch (label) {
            case 'Status':
              return edital.PEP_Codigo_PPS === parseInt(value);
            case 'Programa':
              return edital.PEP_Codigo_PRO === parseInt(value);
            default:
              return true;
          }
        });
      });

    // Agrupar editais por categoria
    return editais.reduce<EditaisAgrupados>((acc, edital) => {
      const categoria = categorizarStatus(edital.PEP_Codigo_PPS);
      const editalProcessado = {
        ...edital,
        PRO_Descricao: programas.find(p => p.PRO_Codigo === edital.PEP_Codigo_PRO)?.PRO_Descricao || '',
        PPS_Descricao: statusList.find(s => s.PPS_Codigo === edital.PEP_Codigo_PPS)?.PPS_Descricao || '',
        // Dados simulados para o protótipo
        projetosSubmetidos: Math.floor(Math.random() * 50),
        projetosAvaliados: Math.floor(Math.random() * 100),
        distribuicaoComite: Math.floor(Math.random() * 100),
        evolucaoSubmissoes: Array.from({ length: 7 }, (_, i) => ({
          data: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
          quantidade: Math.floor(Math.random() * 10)
        }))
      };

      console.log('Processando edital:', {
        codigo: edital.PEP_Codigo,
        descricao: edital.PEP_Descricao,
        statusId: edital.PEP_Codigo_PPS,
        statusDesc: editalProcessado.PPS_Descricao
      });

      acc[categoria].push(editalProcessado);
      return acc;
    }, { emInscricao: [], emAndamento: [], outros: [] });
  }, [periodos, statusList, programas, searchTerm, queryFilters]);

  const tabs = [
    { id: 'inscricao', label: 'Em Inscrição', count: editaisProcessados.emInscricao.length },
    { id: 'andamento', label: 'Em Andamento', count: editaisProcessados.emAndamento.length },
    { id: 'outros', label: 'Outros', count: editaisProcessados.outros.length }
  ];

  if (isLoadingPeriodos) {
    return (
      <div className="flex flex-col h-full p-6">
        <p className="text-content-secondary dark:text-content-secondary-dark">
          Carregando editais...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6">
      <header className="mb-8">
        <div className="flex justify-between items-start mb-6">
              <div>
            <h1 className="text-3xl text-content-main dark:text-content-main-dark">Editais</h1>
            <p className="text-content-secondary dark:text-content-secondary-dark mt-1">
              Gerencie os editais de todos os programas.
                </p>
              </div>
          <Button onClick={() => navigate('/admin/editais/novo')} icon={Plus}>
            Criar Novo Edital
          </Button>
            </div>
      </header>
      
      <div className="flex-grow flex flex-col">
        <div className="mb-6">
          <QueryBuilder
            searchText={searchTerm}
            onSearchChange={setSearchTerm}
            filters={queryFilters}
            onFiltersChange={setQueryFilters}
            statusOptions={statusList.map(s => s.PPS_Descricao)}
              />
            </div>
        
        <Tabs tabs={tabs}>
          {(activeTab) => (
            <div className="space-y-6">
              {activeTab === 'inscricao' && editaisProcessados.emInscricao.map(edital => (
                <EditalPowerCard key={edital.PEP_Codigo} edital={edital} />
              ))}
              
              {activeTab === 'andamento' && editaisProcessados.emAndamento.map(edital => (
                <EditalPowerCard key={edital.PEP_Codigo} edital={edital} />
              ))}
              
              {activeTab === 'outros' && editaisProcessados.outros.map(edital => (
                <EditalPowerCard key={edital.PEP_Codigo} edital={edital} />
              ))}

              {((activeTab === 'inscricao' && editaisProcessados.emInscricao.length === 0) ||
                (activeTab === 'andamento' && editaisProcessados.emAndamento.length === 0) ||
                (activeTab === 'outros' && editaisProcessados.outros.length === 0)) && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-2 dark:bg-surface-dark-2 mb-4">
                    <FileText className="w-6 h-6 text-content-secondary dark:text-content-secondary-dark" />
              </div>
                  <h3 className="text-lg font-medium text-content-main dark:text-content-main-dark mb-2">
                    Nenhum edital encontrado
                  </h3>
                  <p className="text-content-secondary dark:text-content-secondary-dark">
                    Não há editais {activeTab === 'inscricao' ? 'em inscrição' : activeTab === 'andamento' ? 'em andamento' : ''} no momento.
              </p>
            </div>
              )}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
} 