import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Trash2, X } from 'lucide-react';
import { formatDate } from '../utils/format';

const DeletedLedgersModal = ({ isOpen, onClose, ledgers, isLoading, onDeleteNow, onRestore }) => {
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
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-hidden flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Deleted ledgers</h2>
                <p className="text-sm text-slate-500">
                  Restore a ledger before it is permanently deleted
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close deleted ledgers"
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <div key={item} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : ledgers.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No deleted ledgers</p>
              ) : (
                <ul className="space-y-3">
                  {ledgers.map((ledger) => (
                    <li
                      key={ledger._id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 truncate">{ledger.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Deletes on {formatDate(ledger.purgeAt)}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onRestore(ledger)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteNow(ledger)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-700 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete now
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeletedLedgersModal;
