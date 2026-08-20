import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '../utils/format';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, transaction }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(transaction);
      onClose();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && transaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={isDeleting ? undefined : onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Delete transaction</h2>
                  <p className="text-sm text-slate-500">This cannot be undone</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this{' '}
                {transaction.type === 'income' ? 'income' : 'expense'}?
              </p>

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-800 truncate">{transaction.activity}</p>
                <p
                  className={`mt-1 text-sm font-semibold tabular-nums ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '−'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
