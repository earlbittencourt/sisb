import React from 'react';

interface DataTableProps {
  columns: { key: string; label: string; className?: string }[];
  data: Record<string, any>[];
  actions?: (row: Record<string, any>) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-slate-800">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={
                  'text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold py-3 px-6 text-left ' +
                  (col.className || '')
                }
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold py-3 px-6 text-left">Ações</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-4 px-6 text-sm text-slate-700 dark:text-slate-200"
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