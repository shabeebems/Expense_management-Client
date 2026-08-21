import { ArrowDownRight, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, groupByDate } from '../utils/format';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const groups = groupByDate(transactions);

  return (
    <div className="divide-y divide-slate-100">
      {groups.map((group) => (
        <section key={group.key} className="py-4 first:pt-0 last:pb-0">
          <div className="px-1 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {group.label}
            </p>
          </div>

          <div className="space-y-2">
            {group.items.map((transaction) => {
              const isIncome = transaction.type === 'income';

              return (
                <div
                  key={transaction._id}
                  className="flex items-center gap-3 sm:gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3 sm:px-4 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 truncate">{transaction.activity}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isIncome ? 'Income' : 'Expense'}
                    </p>
                  </div>

                  <p
                    className={`shrink-0 font-semibold tabular-nums text-sm sm:text-base ${
                      isIncome ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isIncome ? '+' : '−'}
                    {formatCurrency(transaction.amount)}
                  </p>

                  {(onEdit || onDelete) && (
                    <div className="shrink-0 flex items-center">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(transaction)}
                          aria-label={`Edit ${transaction.activity}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(transaction)}
                          aria-label={`Delete ${transaction.activity}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TransactionList;
