import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { FilterPill, Filter as FilterType } from './FilterPill';
import Button from './Button';
import { DatePicker } from './DatePicker';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export interface QueryBuilderProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  filters: FilterType[];
  onFiltersChange: (filters: FilterType[]) => void;
  statusOptions?: string[];
}

export function QueryBuilder({
  searchText,
  onSearchChange,
  filters,
  onFiltersChange,
  statusOptions = []
}: QueryBuilderProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [newFilter, setNewFilter] = useState<{ label: string; condition: string; value: string[] | string }>({ label: '', condition: '', value: '' });
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const dateFields = ['Data de Início', 'Data de Fim'];

  function handleRemoveFilter(id: string) {
    const newFilters = filters.filter(f => f.id !== id);
    onFiltersChange(newFilters);
  }

  function handleApplyFilter() {
    if (!newFilter.label || !newFilter.condition) return;
    let value: string;
    if (dateFields.includes(newFilter.label)) {
      if (newFilter.condition === 'entre') {
        if (!dateRange.start || !dateRange.end) return;
        value = `${dateRange.start},${dateRange.end}`;
      } else {
        if (!newFilter.value) return;
        value = Array.isArray(newFilter.value) ? newFilter.value[0] : newFilter.value;
      }
    } else {
      if (!newFilter.value || (Array.isArray(newFilter.value) && newFilter.value.length === 0)) return;
      value = Array.isArray(newFilter.value) ? newFilter.value.join(',') : newFilter.value;
    }
    const newFilterWithId = { ...newFilter, value, id: generateId() };
    const newFilters = [...filters, newFilterWithId];
    onFiltersChange(newFilters);
    setNewFilter({ label: '', condition: '', value: '' });
    setDateRange({ start: '', end: '' });
    setShowPopover(false);
  }

  return (
    <div className="flex items-center w-full gap-2 p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-card relative">
      <Search className="h-5 w-5 text-stone-400 flex-shrink-0" />
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map(filter => (
          <FilterPill key={filter.id} filter={filter} onRemove={handleRemoveFilter} />
        ))}
      </div>
      <input
        type="text"
        value={searchText}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Pesquise ou adicione um filtro..."
        className="flex-grow p-0 border-none focus:ring-0 bg-transparent text-sm placeholder:text-stone-400 min-w-[120px]"
      />
      <button
        className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-md"
        onClick={() => setShowPopover(v => !v)}
        aria-label="Adicionar filtro"
        type="button"
      >
        <Filter className="h-5 w-5 text-stone-500" />
      </button>
      {showPopover && (
         <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg p-4 z-50 flex flex-col gap-3">
         <div className="relative">
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-200">Campo</label>
            <select
             className="w-full rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition placeholder:text-gray-400 appearance-none pr-8"
              value={newFilter.label}
             onChange={e => setNewFilter({ label: e.target.value, condition: '', value: '' })}
            >
              <option value="">Selecione...</option>
             <option value="Título">Título</option>
             <option value="Programa">Programa</option>
              <option value="Status">Status</option>
             <option value="Data de Início">Data de Início</option>
             <option value="Data de Fim">Data de Fim</option>
            </select>
           <ChevronDown className="absolute right-3 top-8 text-gray-400 pointer-events-none w-4 h-4" />
          </div>
         
         <div className="relative">
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-200">Condição</label>
            <select
             className="w-full rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition placeholder:text-gray-400 appearance-none pr-8"
              value={newFilter.condition}
              onChange={e => setNewFilter(f => ({ ...f, condition: e.target.value }))}
            >
              <option value="">Selecione...</option>
             {dateFields.includes(newFilter.label)
               ? <>
                   <option value="é igual">é igual</option>
                   <option value="maior que">maior que</option>
                   <option value="menor que">menor que</option>
                   <option value="entre">entre</option>
                 </>
               : <>
                   <option value="contém">contém</option>
                   <option value="não contém">não contém</option>
              <option value="é">é</option>
              <option value="não é">não é</option>
                 </>
             }
            </select>
           <ChevronDown className="absolute right-3 top-8 text-gray-400 pointer-events-none w-4 h-4" />
          </div>

         <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-200">Valor</label>
           {newFilter.label === 'Status' && statusOptions.length > 0 ? (
             <select
               multiple
               className="w-full rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition placeholder:text-gray-400 min-h-[80px]"
               value={Array.isArray(newFilter.value) ? newFilter.value : []}
               onChange={e => {
                 const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                 setNewFilter(f => ({ ...f, value: selected }));
               }}
             >
               {statusOptions.map(opt => (
                 <option key={opt} value={opt}>{opt}</option>
               ))}
             </select>
           ) : dateFields.includes(newFilter.label) ? (
             newFilter.condition === 'entre' ? (
               <div className="flex gap-2 items-center">
                 <DatePicker
                   value={dateRange.start ? new Date(dateRange.start) : undefined}
                   onChange={(date) => setDateRange(r => ({ ...r, start: date ? date.toISOString().split('T')[0] : '' }))}
                   placeholder="Data inicial"
                   className="flex-1"
                 />
                 <span className="text-stone-500">até</span>
                 <DatePicker
                   value={dateRange.end ? new Date(dateRange.end) : undefined}
                   onChange={(date) => setDateRange(r => ({ ...r, end: date ? date.toISOString().split('T')[0] : '' }))}
                   placeholder="Data final"
                   className="flex-1"
                 />
               </div>
             ) : (
               <DatePicker
                 value={typeof newFilter.value === 'string' && newFilter.value ? new Date(newFilter.value) : undefined}
                 onChange={(date) => setNewFilter(f => ({ ...f, value: date ? date.toISOString().split('T')[0] : '' }))}
                 placeholder="Selecione uma data"
               />
             )
           ) : (
            <input
              type="text"
               className="w-full rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition placeholder:text-gray-400"
               value={typeof newFilter.value === 'string' ? newFilter.value : ''}
              onChange={e => setNewFilter(f => ({ ...f, value: e.target.value }))}
            />
           )}
          </div>

         <div className="flex justify-end gap-2 pt-2">
            <button
             className="px-3 py-1 text-sm rounded bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-600"
              onClick={() => setShowPopover(false)}
              type="button"
            >
              Cancelar
            </button>
           <Button onClick={handleApplyFilter} type="button">
              Aplicar
           </Button>
          </div>
        </div>
      )}
    </div>
  );
} 