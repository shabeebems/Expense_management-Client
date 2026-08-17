import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, TrendingUp, TrendingDown } from 'lucide-react';

const AddTransactionModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    activity: '',
    amount: 0,
    type: 'expense',
  });
  const [activityError, setActivityError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.activity.trim()) {
      setActivityError('Description is required');
      return;
    }

    if (formData.activity.trim().length < 3) {
      setActivityError('Description must be at least 3 characters');
      return;
    }

    if (formData.amount <= 0) return;

    setActivityError('');
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData({ activity: '', amount: 0, type: 'expense' });
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ activity: '', amount: 0, type: 'expense' });
    setActivityError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={handleClose}
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
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Add transaction</h2>
                <p className="text-sm text-slate-500">Record income or an expense</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: 'income' }))}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                    formData.type === 'income'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: 'expense' }))}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                    formData.type === 'expense'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  Expense
                </button>
              </div>

              <label htmlFor="activity" className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <input
                id="activity"
                type="text"
                value={formData.activity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    activity: e.target.value,
                  }))
                }
                placeholder="e.g. Salary, Groceries, Rent"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 mb-4 ${
                  activityError
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
                autoFocus
                disabled={isSubmitting}
              />
              {activityError && <p className="-mt-2 mb-4 text-sm text-rose-600">{activityError}</p>}

              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                Amount (₹)
              </label>
              <input
                id="amount"
                type="number"
                value={formData.amount || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: Number(e.target.value),
                  }))
                }
                placeholder="0"
                min="0"
                step="0.01"
                inputMode="decimal"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                disabled={isSubmitting}
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.activity.trim() || formData.amount <= 0 || isSubmitting}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium disabled:opacity-50 cursor-pointer ${
                    formData.type === 'income'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isSubmitting ? 'Saving...' : `Add ${formData.type}`}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTransactionModal;
