import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import AppShell from '../../Components/AppShell';
import CreateLedgerModal from '../../Components/CreateLedgerModal';
import ConfirmDeleteLedgerModal from '../../Components/ConfirmDeleteLedgerModal';
import DeletedLedgersModal from '../../Components/DeletedLedgersModal';
import DonutChart from '../../Components/DonutChart';
import RowActionsMenu from '../../Components/RowActionsMenu';
import EmptyState from '../../Components/EmptyState';
import { formatCurrency, formatDate } from '../../utils/format';

const ICON_TONES = [
  'bg-emerald-50 text-emerald-600',
  'bg-blue-50 text-blue-600',
  'bg-violet-50 text-violet-600',
  'bg-amber-50 text-amber-600',
];

const toneFor = (id = '') => {
  let hash = 0;
  for (const char of String(id)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return ICON_TONES[hash % ICON_TONES.length];
};

const ROW_GRID = 'md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-4';

const Home = () => {
  const [ledgers, setLedgers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLedger, setEditingLedger] = useState(null);
  const [deletingLedger, setDeletingLedger] = useState(null);
  const [deleteMode, setDeleteMode] = useState('schedule');
  const [deletedLedgers, setDeletedLedgers] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isLoadingDeleted, setIsLoadingDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const openCreateModal = () => {
    setEditingLedger(null);
    setShowModal(true);
  };

  const openEditModal = (ledger) => {
    setEditingLedger(ledger);
    setShowModal(true);
  };

  const closeModal = (open) => {
    setShowModal(open);
    if (!open) setEditingLedger(null);
  };

  const openLedger = (ledger) => navigate(`/ledger/${ledger._id}`);

  const fetchLedgers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger`,
        { withCredentials: true }
      );
      setLedgers(response.data || []);
    } catch (err) {
      console.error('Error fetching ledgers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeletedLedgers = async () => {
    try {
      setIsLoadingDeleted(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger/deleted`,
        { withCredentials: true }
      );
      setDeletedLedgers(response.data || []);
    } catch (err) {
      console.error('Error fetching deleted ledgers:', err);
    } finally {
      setIsLoadingDeleted(false);
    }
  };

  useEffect(() => {
    fetchLedgers();
    fetchDeletedLedgers();
  }, []);

  const handleSubmit = async (name, ledger) => {
    if (ledger) {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledger._id}`,
        { newName: name },
        { withCredentials: true }
      );
      setLedgers((prev) =>
        prev.map((item) => (item._id === ledger._id ? response.data : item))
      );
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API_URL}/api/ledger`,
      { newName: name },
      { withCredentials: true }
    );
    setLedgers((prev) => [response.data, ...prev]);
    setSearch('');
  };

  const openDeleteModal = (ledger) => {
    setDeleteMode('schedule');
    setDeletingLedger(ledger);
  };

  const openPermanentDelete = (ledger) => {
    setDeleteMode('permanent');
    setDeletingLedger(ledger);
  };

  const handleDeleteLedger = async (ledger) => {
    if (deleteMode === 'permanent') {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledger._id}/permanent`,
        { withCredentials: true }
      );
      setDeletedLedgers((prev) => prev.filter((item) => item._id !== ledger._id));
      return;
    }

    await axios.delete(`${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledger._id}`, {
      withCredentials: true,
    });
    setLedgers((prev) => prev.filter((item) => item._id !== ledger._id));
    await fetchDeletedLedgers();
  };

  const handleRestoreLedger = async (ledger) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledger._id}/restore`,
        {},
        { withCredentials: true }
      );
      setDeletedLedgers((prev) => prev.filter((item) => item._id !== ledger._id));
      setLedgers((prev) => [response.data, ...prev.filter((item) => item._id !== ledger._id)]);
    } catch (error) {
      console.error('Error restoring ledger:', error);
    }
  };

  const totals = ledgers.reduce(
    (acc, ledger) => ({
      income: acc.income + (ledger.totalIncome || 0),
      expense: acc.expense + (ledger.totalExpense || 0),
    }),
    { income: 0, expense: 0 }
  );
  const balance = totals.income - totals.expense;

  const filteredLedgers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ledgers;
    return ledgers.filter((ledger) => ledger.name.toLowerCase().includes(term));
  }, [ledgers, search]);

  const deletedButton = (
    <button
      type="button"
      onClick={() => setShowDeleted(true)}
      aria-label="Deleted ledgers"
      title="Deleted ledgers"
      className="relative shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
    >
      <Archive className="w-4 h-4" />
      {deletedLedgers.length > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-rose-600 text-[10px] font-semibold text-white flex items-center justify-center">
          {deletedLedgers.length}
        </span>
      )}
    </button>
  );

  return (
    <AppShell fullWidth>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Your Ledgers
            </h1>
            {!isLoading && (
              <span
                className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700"
                title="Total ledgers"
              >
                <BookOpen className="w-4 h-4" />
                {ledgers.length} {ledgers.length === 1 ? 'ledger' : 'ledgers'}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm sm:text-base text-slate-500">
            Each ledger is a separate book for one part of your finances.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 lg:w-64 lg:flex-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ledgers..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          {deletedButton}
          <button
            type="button"
            onClick={openCreateModal}
            className="shrink-0 inline-flex items-center justify-center gap-2 h-11 px-4 sm:px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Ledger</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] 2xl:grid-cols-[440px_minmax(0,1fr)] gap-6">
          <div className="h-[520px] rounded-2xl bg-white border border-slate-100 animate-pulse" />
          <div className="h-[520px] rounded-2xl bg-white border border-slate-100 animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] 2xl:grid-cols-[440px_minmax(0,1fr)] gap-6 items-start">
          <section className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            {ledgers.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="Create your first ledger"
                description="Start a book for personal spending, business, or any category you want to track on its own."
                action={
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    New Ledger
                  </button>
                }
              />
            ) : filteredLedgers.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No matching ledgers"
                description="Try a different name, or create a new ledger."
              />
            ) : (
              <>
                <div
                  className={`hidden ${ROW_GRID} px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl text-xs font-semibold text-slate-500`}
                >
                  <span>Ledger</span>
                  <span className="text-right">Income</span>
                  <span className="text-right">Expenses</span>
                  <span className="text-right">Net Balance</span>
                  <span className="w-9 text-center">Actions</span>
                </div>

                <ul className="divide-y divide-slate-100">
                  {filteredLedgers.map((ledger, index) => {
                    const income = ledger.totalIncome || 0;
                    const expense = ledger.totalExpense || 0;
                    const net = income - expense;

                    return (
                      <motion.li
                        key={ledger._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => openLedger(ledger)}
                        className={`${ROW_GRID} flex items-center gap-3 px-4 sm:px-5 py-3.5 last:rounded-b-2xl hover:bg-slate-50/70 transition-colors cursor-pointer`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${toneFor(ledger._id)}`}
                          >
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{ledger.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Created {formatDate(ledger.createdAt)}
                            </p>
                            <p className="md:hidden mt-1 text-xs tabular-nums">
                              <span className="text-emerald-600">{formatCurrency(income)}</span>
                              <span className="text-slate-300"> · </span>
                              <span className="text-rose-600">{formatCurrency(expense)}</span>
                            </p>
                          </div>
                        </div>

                        <p className="hidden md:block text-right font-semibold tabular-nums text-emerald-600 truncate">
                          {formatCurrency(income)}
                        </p>
                        <p className="hidden md:block text-right font-semibold tabular-nums text-rose-600 truncate">
                          {formatCurrency(expense)}
                        </p>
                        <p
                          className={`shrink-0 text-right font-semibold tabular-nums truncate ${
                            net < 0 ? 'text-rose-600' : 'text-slate-900'
                          }`}
                        >
                          {formatCurrency(net)}
                        </p>

                        <div className="shrink-0 flex justify-center">
                          <RowActionsMenu
                            label={`Actions for ${ledger.name}`}
                            items={[
                              { label: 'Open', icon: ArrowUpRight, onSelect: () => openLedger(ledger) },
                              { label: 'Rename', icon: Pencil, onSelect: () => openEditModal(ledger) },
                              { label: 'Delete', icon: Trash2, onSelect: () => openDeleteModal(ledger), danger: true },
                            ]}
                          />
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </>
            )}
          </section>

          <aside className="lg:order-first bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
            <p className="text-sm text-slate-500">Your overall financial summary</p>

            <div className="mt-6 flex flex-col items-center gap-6">
              <DonutChart income={totals.income} expense={totals.expense}>
                <p
                  className={`text-lg font-bold tabular-nums leading-tight ${
                    balance < 0 ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {formatCurrency(balance)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Net balance</p>
              </DonutChart>

              <dl className="w-full grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50/60 px-3.5 py-3">
                  <span className="mt-1.5 w-2.5 h-2.5 bg-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500">Total Income</dt>
                    <dd className="font-semibold text-slate-900 tabular-nums truncate">
                      {formatCurrency(totals.income)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl bg-rose-50/60 px-3.5 py-3">
                  <span className="mt-1.5 w-2.5 h-2.5 bg-rose-500 shrink-0" />
                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500">Total Expenses</dt>
                    <dd className="font-semibold text-slate-900 tabular-nums truncate">
                      {formatCurrency(totals.expense)}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      )}

      <CreateLedgerModal
        showModal={showModal}
        setShowModal={closeModal}
        ledger={editingLedger}
        onSubmit={handleSubmit}
      />
      <ConfirmDeleteLedgerModal
        isOpen={Boolean(deletingLedger)}
        ledger={deletingLedger}
        permanent={deleteMode === 'permanent'}
        onClose={() => setDeletingLedger(null)}
        onConfirm={handleDeleteLedger}
      />
      <DeletedLedgersModal
        isOpen={showDeleted}
        ledgers={deletedLedgers}
        isLoading={isLoadingDeleted}
        onClose={() => setShowDeleted(false)}
        onDeleteNow={openPermanentDelete}
        onRestore={handleRestoreLedger}
      />
    </AppShell>
  );
};

export default Home;
