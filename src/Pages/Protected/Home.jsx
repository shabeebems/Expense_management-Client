import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronRight,
} from 'lucide-react';
import AppShell from '../../Components/AppShell';
import CreateLedgerModal from '../../Components/CreateLedgerModal';
import StatCard from '../../Components/StatCard';
import EmptyState from '../../Components/EmptyState';
import { formatCurrency, formatDate } from '../../utils/format';

const Home = () => {
  const [ledgers, setLedgers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchLedgers();
  }, []);

  const handleSubmit = async (name) => {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API_URL}/api/ledger`,
      { newName: name },
      { withCredentials: true }
    );
    setLedgers((prev) => [response.data, ...prev]);
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

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-emerald-600 mb-1">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Your ledgers
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-500">
            Each ledger is a separate book for one part of your finances.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New ledger
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-24 rounded-2xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-40 rounded-2xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
            <StatCard
              label="Total income"
              value={formatCurrency(totals.income)}
              icon={TrendingUp}
              tone="emerald"
            />
            <StatCard
              label="Total expenses"
              value={formatCurrency(totals.expense)}
              icon={TrendingDown}
              tone="rose"
            />
            <StatCard
              label="Net balance"
              value={formatCurrency(balance)}
              hint={`${ledgers.length} ledger${ledgers.length === 1 ? '' : 's'}`}
              icon={Wallet}
              tone="slate"
            />
          </div>

          {ledgers.length > 0 && (
            <div className="relative mb-5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ledgers..."
                className="w-full sm:max-w-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          )}

          {ledgers.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
              <EmptyState
                icon={BookOpen}
                title="Create your first ledger"
                description="Start a book for personal spending, business, or any category you want to track on its own."
                action={
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    New ledger
                  </button>
                }
              />
            </div>
          ) : filteredLedgers.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
              <EmptyState
                icon={Search}
                title="No matching ledgers"
                description="Try a different name, or create a new ledger."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLedgers.map((ledger, index) => {
                const net = (ledger.totalIncome || 0) - (ledger.totalExpense || 0);
                const totalFlow = (ledger.totalIncome || 0) + (ledger.totalExpense || 0);
                const incomeShare = totalFlow ? ((ledger.totalIncome || 0) / totalFlow) * 100 : 50;

                return (
                  <motion.button
                    key={ledger._id}
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => navigate(`/ledger/${ledger._id}`)}
                    className="text-left bg-white border border-slate-100 hover:border-emerald-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-lg font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                            {ledger.name}
                          </h2>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Created {formatDate(ledger.createdAt)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 shrink-0 mt-1" />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-emerald-50/80 px-3 py-2.5">
                        <p className="text-xs text-emerald-700">Income</p>
                        <p className="text-sm font-semibold text-emerald-700 mt-0.5 truncate">
                          {formatCurrency(ledger.totalIncome)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-rose-50/80 px-3 py-2.5">
                        <p className="text-xs text-rose-700">Expenses</p>
                        <p className="text-sm font-semibold text-rose-700 mt-0.5 truncate">
                          {formatCurrency(ledger.totalExpense)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-500">Net balance</span>
                        <span className={`font-semibold ${net >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {formatCurrency(net)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-rose-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${incomeShare}%` }}
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </>
      )}

      <CreateLedgerModal
        showModal={showModal}
        setShowModal={setShowModal}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
};

export default Home;
