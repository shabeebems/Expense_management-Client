import { ArrowDownRight, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import RowActionsMenu from './RowActionsMenu';
import { formatCurrency, formatDate } from '../utils/format';

const ROW_GRID =
  'md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-4';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  return (
    <>
      <div
        className={`hidden ${ROW_GRID} px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 text-xs font-semibold text-slate-500`}
      >
        <span>Transaction</span>
        <span>Category</span>
        <span>Date</span>
        <span className="text-right">Amount</span>
        <span className="w-9 text-center">Actions</span>
      </div>

      <ul className="divide-y divide-slate-100">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === 'income';
          const categoryName = transaction.category?.name;

          return (
            <li
              key={transaction._id}
              className={`${ROW_GRID} flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-slate-50/70 transition-colors`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`shrink-0 w-10 h-10 flex items-center justify-center ${
                    isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{transaction.activity}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{isIncome ? 'Income' : 'Expense'}</p>
                  <p className="md:hidden mt-1 text-xs text-slate-500 truncate">
                    {formatDate(transaction.date)}
                    <span className="text-slate-300"> · </span>
                    {categoryName || 'Uncategorized'}
                  </p>
                </div>
              </div>

              <div className="hidden md:block min-w-0">
                {categoryName ? (
                  <span className="inline-block max-w-full truncate bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {categoryName}
                  </span>
                ) : onEdit ? (
                  <button
                    type="button"
                    onClick={() => onEdit(transaction)}
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    Assign category
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </div>

              <p className="hidden md:block text-sm text-slate-600 tabular-nums">
                {formatDate(transaction.date)}
              </p>

              <p
                className={`shrink-0 text-right font-semibold tabular-nums ${
                  isIncome ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isIncome ? '+' : '−'}
                {formatCurrency(transaction.amount)}
              </p>

              {(onEdit || onDelete) && (
                <div className="shrink-0 flex justify-center">
                  <RowActionsMenu
                    label={`Actions for ${transaction.activity}`}
                    items={[
                      ...(onEdit ? [{ label: 'Edit', icon: Pencil, onSelect: () => onEdit(transaction) }] : []),
                      ...(onDelete
                        ? [{ label: 'Delete', icon: Trash2, onSelect: () => onDelete(transaction), danger: true }]
                        : []),
                    ]}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default TransactionList;
