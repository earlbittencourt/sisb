import React, { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { FilterPill, Filter as FilterType } from './FilterPill';

// Importe a interface Filter conforme o seu projeto
// interface Filter { id: string; label: string; condition: string; value: string; }

interface Filter {
  id: string;
  label: string;
  condition: string;
  value: string;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function QueryBuilder() {
  const [query, setQuery] = useState<{ searchText: string; filters: FilterType[] }>({ searchText: '', filters: [] });
  const [showPopover, setShowPopover] = useState(false);
  const [newFilter, setNewFilter] = useState<{ label: string; condition: string; value: string }>({ label: '', condition: '', value: '' });

  function handleRemoveFilter(id: string) {
    setQuery(q => ({ ...q, filters: q.filters.filter(f => f.id !== id) }));
  }

  function handleApplyFilter() {
    if (!newFilter.label || !newFilter.condition || !newFilter.value) return;
    setQuery(q => ({
      ...q,
      filters: [...q.filters, { ...newFilter, id: generateId() }],
    }));
    setNewFilter({ label: '', condition: '', value: '' });
    setShowPopover(false);
  }

  return (
    <div className="flex items-center w-full gap-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-card relative">
      <FiSearch className="h-5 w-5 text-gray-400 flex-shrink-0" />
      {/* Pills de filtros ativos */}
      <div className="flex items-center gap-2">
        {query.filters.map(filter => (
          <FilterPill key={filter.id} filter={filter} onRemove={handleRemoveFilter} />
        ))}
      </div>
      {/* Input de texto */}
      <input
        type="text"
        value={query.searchText}
        onChange={e => setQuery({ ...query, searchText: e.target.value })}
        placeholder="Pesquise ou adicione um filtro..."
        className="flex-grow p-0 border-none focus:ring-0 bg-transparent text-sm placeholder:text-gray-400 min-w-[120px]"
      />
      {/* Botão filtro */}
      <button
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        onClick={() => setShowPopover(v => !v)}
        aria-label="Adicionar filtro"
        type="button"
      >
        <FiFilter className="h-5 w-5 text-gray-500" />
      </button>
      {/* Popover de filtro */}
      {showPopover && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
          <div className="mb-3">
            <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-200">Campo</label>
            <select
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm"
              value={newFilter.label}
              onChange={e => setNewFilter(f => ({ ...f, label: e.target.value }))}
            >
              <option value="">Selecione...</option>
              <option value="Status">Status</option>
              <option value="Programa">Programa</option>
              <option value="Título">Título</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-200">Condição</label>
            <select
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm"
              value={newFilter.condition}
              onChange={e => setNewFilter(f => ({ ...f, condition: e.target.value }))}
            >
              <option value="">Selecione...</option>
              <option value="é">é</option>
              <option value="não é">não é</option>
              <option value="contém">contém</option>
              <option value="não contém">não contém</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-200">Valor</label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm"
              value={newFilter.value}
              onChange={e => setNewFilter(f => ({ ...f, value: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 text-sm rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setShowPopover(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="px-3 py-1 text-sm rounded bg-primary text-white hover:bg-primary-dark"
              onClick={handleApplyFilter}
              type="button"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 