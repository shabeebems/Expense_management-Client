import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Pencil, BookOpen } from 'lucide-react';

const CreateLedgerModal = ({ showModal, setShowModal, onSubmit, ledger = null }) => {
  const isEditing = Boolean(ledger);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showModal) {
      setName(ledger?.name || '');
      setNameError('');
    }
  }, [showModal, ledger]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError('Ledger name is required');
      return;
    }

    if (name.trim().length < 3) {
      setNameError('Ledger name must be at least 3 characters');
      return;
    }

    setNameError('');
    setIsSubmitting(true);

    try {
      await onSubmit(name.trim(), ledger);
      setName('');
      setShowModal(false);
    } catch (error) {
      console.error(isEditing ? 'Error updating ledger:' : 'Error creating ledger:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setNameError('');
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && (
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
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {isEditing ? 'Edit ledger' : 'New ledger'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEditing ? 'Update the name of this book' : 'Give this book a clear name'}
                  </p>
                </div>
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
              <label htmlFor="ledgerName" className="block text-sm font-medium text-slate-700 mb-2">
                Ledger name
              </label>
              <input
                id="ledgerName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Personal, Shop, Travel"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all ${
                  nameError
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
                autoFocus
                disabled={isSubmitting}
              />
              {nameError && <p className="mt-2 text-sm text-rose-600">{nameError}</p>}

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
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isEditing ? (
                    <Pencil className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isSubmitting ? (isEditing ? 'Saving...' : 'Creating...') : isEditing ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateLedgerModal;
