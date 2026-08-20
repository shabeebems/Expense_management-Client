import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Calendar,
  Plus,
  Pencil,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
  Receipt,
} from 'lucide-react';
import AppShell from '../../Components/AppShell';
import AddTransactionModal from '../../Components/AddTransactionModal';
import CreateLedgerModal from '../../Components/CreateLedgerModal';
import ConfirmDeleteModal from '../../Components/ConfirmDeleteModal';
import StatCard from '../../Components/StatCard';
import EmptyState from '../../Components/EmptyState';
import TransactionList from '../../Components/TransactionList';
import { formatCurrency, formatDate } from '../../utils/format';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expenses' },
];

const Ledger = () => {
  const { ledgerId } = useParams();
  const navigate = useNavigate();

  const [ledger, setLedger] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      const [ledgerRes, txRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledgerId}`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}`, {
          withCredentials: true,
        }),
      ]);
      setLedger(ledgerRes.data);
      setTransactions(txRes.data || []);
    } catch (error) {
      console.error('Error loading ledger:', error);
      setLedger(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, [ledgerId]);

  const openCreateTransaction = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const openEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const closeTransactionModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  const closeDeleteModal = () => {
    setDeletingTransaction(null);
  };

  const handleDeleteTransaction = async (transaction) => {
    await axios.delete(
      `${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}/${transaction._id}`,
      { withCredentials: true }
    );
    await loadData();
  };

  const handleLedgerSubmit = async (name) => {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledgerId}`,
      { newName: name },
      { withCredentials: true }
    );
    setLedger(response.data);
  };

  const handleTransactionSubmit = async (data, transaction) => {
    if (transaction) {
      await axios.put(
        `${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}/${transaction._id}`,
        data,
        { withCredentials: true }
      );
    } else {
      await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}`,
        data,
        { withCredentials: true }
      );
    }
    closeTransactionModal();
    await loadData();
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesType = activeFilter === 'all' || transaction.type === activeFilter;
      const matchesSearch = transaction.activity
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [transactions, activeFilter, searchTerm]);

  const totals = {
    income: ledger?.totalIncome || 0,
    expense: ledger?.totalExpense || 0,
  };
  const net = totals.income - totals.expense;
  const flow = totals.income + totals.expense;
  const incomeShare = flow ? (totals.income / flow) * 100 : 50;

  if (isLoading) {
    return (
      <AppShell>
        <div className="h-8 w-40 rounded-lg bg-slate-200 animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 rounded-2xl bg-white border border-slate-100 animate-pulse" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-white border border-slate-100 animate-pulse" />
      </AppShell>
    );
  }

  if (!ledger) {
    return (
      <AppShell>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
          <EmptyState
            icon={Receipt}
            title="Ledger not found"
            description="This ledger may have been removed, or you do not have access to it."
            action={
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full cursor-pointer"
              >
                Back to ledgers
              </button>
            }
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell withDock>
      <button
        type="button"
        onClick={() => navigate('/home')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-700 mb-5 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        All ledgers
      </button>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
              {ledger.name}
            </h1>
            <button
              type="button"
              onClick={() => setShowLedgerModal(true)}
              aria-label="Edit ledger"
              className="p-2 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            Created {formatDate(ledger.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateTransaction}
          className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add transaction
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <StatCard
          label="Income"
          value={formatCurrency(totals.income)}
          icon={TrendingUp}
          tone="emerald"
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(totals.expense)}
          icon={TrendingDown}
          tone="rose"
        />
        <StatCard
          label="Net balance"
          value={formatCurrency(net)}
          icon={Wallet}
          tone="slate"
        />
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 mb-6 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Income vs expenses</span>
          <span>{flow ? `${Math.round(incomeShare)}% income` : 'No activity yet'}</span>
        </div>
        <div className="h-2 rounded-full bg-rose-100 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${incomeShare}%` }} />
        </div>
      </div>

      <section className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Transactions</h2>
            <span className="text-xs text-slate-400">
              {filteredTransactions.length} of {transactions.length}
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === filter.key
                    ? filter.key === 'income'
                      ? 'bg-emerald-600 text-white'
                      : filter.key === 'expense'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {transactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Add your first income or expense to start tracking this ledger."
              action={
                <button
                  type="button"
                  onClick={openCreateTransaction}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add transaction
                </button>
              }
            />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching transactions"
              description="Try another search term or filter."
            />
          ) : (
            <TransactionList
              transactions={filteredTransactions}
              onEdit={openEditTransaction}
              onDelete={setDeletingTransaction}
            />
          )}
        </div>
      </section>

      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100">
        <button
          type="button"
          onClick={openCreateTransaction}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add transaction
        </button>
      </div>

      <AddTransactionModal
        isOpen={showModal}
        onClose={closeTransactionModal}
        onSubmit={handleTransactionSubmit}
        transaction={editingTransaction}
      />
      <CreateLedgerModal
        showModal={showLedgerModal}
        setShowModal={setShowLedgerModal}
        ledger={ledger}
        onSubmit={handleLedgerSubmit}
      />
      <ConfirmDeleteModal
        isOpen={Boolean(deletingTransaction)}
        transaction={deletingTransaction}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteTransaction}
      />
    </AppShell>
  );
};

export default Ledger;
