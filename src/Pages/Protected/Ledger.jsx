import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Download,
  Pencil,
  Plus,
  Receipt,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import AppShell from '../../Components/AppShell';
import AddTransactionModal from '../../Components/AddTransactionModal';
import CreateLedgerModal from '../../Components/CreateLedgerModal';
import ConfirmDeleteModal from '../../Components/ConfirmDeleteModal';
import DonutChart from '../../Components/DonutChart';
import EmptyState from '../../Components/EmptyState';
import TransactionList from '../../Components/TransactionList';
import TransactionFilterModal from '../../Components/TransactionFilterModal';
import { formatCurrency, formatDate } from '../../utils/format';
import { downloadLedgerPdf } from '../../utils/downloadLedgerPdf';

const PAGE_GRID = 'grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] 2xl:grid-cols-[440px_minmax(0,1fr)] gap-6';

const TYPE_LABELS = { income: 'Income', expense: 'Expenses' };

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
  const [isExporting, setIsExporting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      const [ledgerRes, txRes, categoryRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledgerId}`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/categories/${ledgerId}`, {
          withCredentials: true,
        }),
      ]);
      setLedger(ledgerRes.data);
      setTransactions(txRes.data || []);
      setCategories(categoryRes.data || []);
    } catch (error) {
      console.error('Error loading ledger:', error);
      setLedger(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setActiveFilter('all');
    setSelectedCategories([]);
    setShowFilters(false);
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

  const handleCreateCategory = async (name) => {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API_URL}/api/categories/${ledgerId}`,
      { name },
      { withCredentials: true }
    );
    setCategories((current) =>
      [...current, response.data].sort((a, b) => a.name.localeCompare(b.name))
    );
    return response.data;
  };

  const handleDownloadPdf = () => {
    if (!ledger || transactions.length === 0 || isExporting) return;
    setIsExporting(true);
    window.setTimeout(async () => {
      try {
        await downloadLedgerPdf({ ledger, transactions });
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsExporting(false);
      }
    }, 50);
  };

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesType = activeFilter === 'all' || transaction.type === activeFilter;
      const categoryId = String(transaction.category?._id || transaction.categoryId || '');
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((key) => (key === 'none' ? !categoryId : categoryId === key));
      const categoryName = transaction.category?.name || '';
      const matchesSearch =
        !query ||
        transaction.activity.toLowerCase().includes(query) ||
        categoryName.toLowerCase().includes(query);
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [transactions, activeFilter, selectedCategories, searchTerm]);

  const toggleCategory = (key) => {
    setSelectedCategories((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  };

  const clearFilters = () => {
    setActiveFilter('all');
    setSelectedCategories([]);
  };

  const clearAll = () => {
    clearFilters();
    setSearchTerm('');
  };

  const activeFilterCount = (activeFilter === 'all' ? 0 : 1) + selectedCategories.length;
  const isFiltered = activeFilterCount > 0 || searchTerm.trim() !== '';

  const activeFilterLabels = [
    ...(activeFilter === 'all' ? [] : [TYPE_LABELS[activeFilter]]),
    ...selectedCategories.map((key) =>
      key === 'none'
        ? 'Uncategorized'
        : categories.find((category) => String(category._id) === key)?.name || 'Category'
    ),
    ...(searchTerm.trim() ? [`“${searchTerm.trim()}”`] : []),
  ];

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, transaction) => {
        const amount = Number(transaction.amount) || 0;
        if (transaction.type === 'income') sum.income += amount;
        else sum.expense += amount;
        return sum;
      },
      { income: 0, expense: 0 }
    );
  }, [filteredTransactions]);
  const net = totals.income - totals.expense;

  if (isLoading) {
    return (
      <AppShell fullWidth>
        <div className="h-5 w-28 bg-slate-200 animate-pulse mb-5" />
        <div className="h-9 w-64 bg-slate-200 animate-pulse mb-8" />
        <div className={PAGE_GRID}>
          <div className="h-[420px] bg-white border border-slate-100 animate-pulse" />
          <div className="h-[520px] bg-white border border-slate-100 animate-pulse" />
        </div>
      </AppShell>
    );
  }

  if (!ledger) {
    return (
      <AppShell fullWidth>
        <div className="bg-white border border-slate-100 shadow-sm">
          <EmptyState
            icon={Receipt}
            title="Ledger not found"
            description="This ledger may have been removed, or you do not have access to it."
            action={
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold cursor-pointer"
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
    <AppShell withDock fullWidth>
      <button
        type="button"
        onClick={() => navigate('/home')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-700 mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        All ledgers
      </button>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
              {ledger.name}
            </h1>
            <button
              type="button"
              onClick={() => setShowLedgerModal(true)}
              aria-label="Rename ledger"
              title="Rename ledger"
              className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <span className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              <Receipt className="w-4 h-4" />
              {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
            </span>
          </div>
          <p className="mt-1 text-sm sm:text-base text-slate-500">
            Created {formatDate(ledger.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 lg:w-72 lg:flex-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full h-11 pl-10 pr-4 border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            aria-label="Filter transactions"
            title="Filter transactions"
            className={`relative shrink-0 inline-flex items-center justify-center w-11 h-11 border transition-colors cursor-pointer ${
              activeFilterCount > 0
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-emerald-600 text-[10px] font-semibold text-white flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={transactions.length === 0 || isExporting}
            aria-label="Download PDF statement"
            title="Download PDF statement"
            className="shrink-0 inline-flex items-center justify-center gap-2 h-11 w-11 sm:w-auto sm:px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isExporting ? 'Preparing...' : 'Download PDF'}</span>
          </button>
          <button
            type="button"
            onClick={openCreateTransaction}
            className="hidden sm:inline-flex shrink-0 items-center justify-center gap-2 h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      <div className={`${PAGE_GRID} items-start`}>
        <section className="bg-white border border-slate-100 shadow-sm">
          {transactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Add your first income or expense to start tracking this ledger."
              action={
                <button
                  type="button"
                  onClick={openCreateTransaction}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Transaction
                </button>
              }
            />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching transactions"
              description="Try another search term or filter."
              action={
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer"
                >
                  Clear search and filters
                </button>
              }
            />
          ) : (
            <TransactionList
              transactions={filteredTransactions}
              onEdit={openEditTransaction}
              onDelete={setDeletingTransaction}
            />
          )}
        </section>

        <aside className="lg:order-first bg-white border border-slate-100 shadow-sm p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
          <p className="text-sm text-slate-500">
            {isFiltered
              ? `Showing ${filteredTransactions.length} of ${transactions.length} transactions`
              : 'Summary of this ledger'}
          </p>

          {isFiltered && (
            <div className="mt-4 flex items-start justify-between gap-3 border border-slate-100 bg-slate-50 px-3.5 py-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">Filtered by</p>
                <p className="mt-0.5 text-sm text-slate-800 break-words">{activeFilterLabels.join(', ')}</p>
              </div>
              <button
                type="button"
                onClick={clearAll}
                className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center gap-6">
            <DonutChart income={totals.income} expense={totals.expense}>
              <p
                className={`text-lg font-bold tabular-nums leading-tight ${
                  net < 0 ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {formatCurrency(net)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Net balance</p>
            </DonutChart>

            <dl className="w-full grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5 bg-emerald-50/60 px-3.5 py-3">
                <span className="mt-1.5 w-2.5 h-2.5 bg-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <dt className="text-xs text-slate-500">Total Income</dt>
                  <dd className="font-semibold text-slate-900 tabular-nums truncate">
                    {formatCurrency(totals.income)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-rose-50/60 px-3.5 py-3">
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

      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100">
        <button
          type="button"
          onClick={openCreateTransaction}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      <TransactionFilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        typeFilter={activeFilter}
        onTypeChange={setActiveFilter}
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onClearCategories={() => setSelectedCategories([])}
        onClear={clearFilters}
      />
      <AddTransactionModal
        isOpen={showModal}
        onClose={closeTransactionModal}
        onSubmit={handleTransactionSubmit}
        transaction={editingTransaction}
        categories={categories}
        onCreateCategory={handleCreateCategory}
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
