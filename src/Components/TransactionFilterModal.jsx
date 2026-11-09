import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const typeFilters = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expenses' },
];

const TransactionFilterModal = ({
  isOpen,
  onClose,
  typeFilter,
  onTypeChange,
  categories,
  selectedCategories,
  onToggleCategory,
  onClearCategories,
  onClear,
}) => {
  const categoryOptions = [
    { key: 'none', label: 'Uncategorized' },
    ...categories.map((category) => ({ key: String(category._id), label: category.name })),
  ];
  const hasActive = typeFilter !== 'all' || selectedCategories.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                <p className="text-sm text-slate-500">Type and one or more categories</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Type</p>
                <div className="grid grid-cols-3 gap-2">
                  {typeFilters.map((filter) => {
                    const selected = typeFilter === filter.key;
                    const selectedClass =
                      filter.key === 'income'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : filter.key === 'expense'
                          ? 'border-rose-600 bg-rose-600 text-white'
                          : 'border-slate-900 bg-slate-900 text-white';
                    return (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => onTypeChange(filter.key)}
                        className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                          selected
                            ? selectedClass
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-sm font-medium text-slate-700">Categories</p>
                  <span className="text-xs text-slate-400">Select more than one</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onClearCategories}
                    className={`px-3 py-2 text-sm font-medium border transition-colors cursor-pointer ${
                      selectedCategories.length === 0
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    All categories
                  </button>
                  {categoryOptions.map((option) => {
                    const selected = selectedCategories.includes(option.key);
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => onToggleCategory(option.key)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border transition-colors cursor-pointer ${
                          selected
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5" />}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClear}
                  disabled={!hasActive}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium cursor-pointer disabled:opacity-50"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionFilterModal;
