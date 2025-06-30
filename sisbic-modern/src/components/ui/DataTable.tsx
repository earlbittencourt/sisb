import React from 'react';

interface DataTableProps {
  columns: { key: string; label: string; className?: string }[];
  data: Record<string, any>[];
  actions?: (row: Record<string, any>) => React.ReactNode;
  isLoading?: boolean;
  onRowClick?: (row: Record<string, any>) => void;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, actions, isLoading, onRowClick }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-content-secondary dark:text-content-secondary-dark">Nenhum dado encontrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border-color dark:divide-border-dark">
        <thead className="bg-surface-1 dark:bg-surface-dark-1">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={
                  'text-xs text-content-secondary dark:text-content-secondary-dark uppercase tracking-wider font-semibold py-3 px-6 text-left ' +
                  (col.className || '')
                }
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="text-xs text-content-secondary dark:text-content-secondary-dark uppercase tracking-wider font-semibold py-3 px-6 text-left">Ações</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color dark:divide-border-dark">
          {data.map((row, idx) => (
            <tr 
              key={idx} 
              className={`border-b border-border-color dark:border-border-dark ${onRowClick ? 'hover:bg-surface-2/50 dark:hover:bg-surface-dark-2/50 cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-4 px-6 text-sm text-content-main dark:text-content-main-dark align-top"
                >
                  {row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="py-4 px-6 text-sm">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 