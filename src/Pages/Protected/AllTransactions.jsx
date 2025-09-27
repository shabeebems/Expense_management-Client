import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, Plus, Search, Filter, 
  ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Clock, ArrowLeft
} from 'lucide-react';
import Navbar from '../../Components/Navbar';
import AddTransactionModal from '../../Components/AddTransactionModal';

// Transaction Filters Component
const TransactionFilters = ({ activeFilter, onFilterChange, searchTerm, onSearchChange }) => {
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
            activeFilter === 'all'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white/70 text-gray-600 hover:bg-white/90 backdrop-blur-sm'
          }`}
        >
          All Transactions
        </button>
        <button
          onClick={() => onFilterChange('income')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
            activeFilter === 'income'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-white/70 text-gray-600 hover:bg-white/90 backdrop-blur-sm'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => onFilterChange('expense')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
            activeFilter === 'expense'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/70 text-gray-600 hover:bg-white/90 backdrop-blur-sm'
          }`}
        >
          Expenses
        </button>
      </div>
    </div>
  );
};

// Transaction List Component
const TransactionList = ({ transactions, currentPage, itemsPerPage }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    const transactionDate = new Date(date);
    return transactionDate.toDateString() === today.toDateString();
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const transactionDate = new Date(date);
    return transactionDate.toDateString() === yesterday.toDateString();
  };

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return formatDate(date);
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const dateKey = new Date(transaction.createdAt).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Paginate
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDates = sortedDates.slice(startIndex, endIndex);

  if (transactions.length === 0) {
    return (
      <div className="px-4 pb-6">
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-medium">No transactions found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6">
      {paginatedDates.map((dateKey, index) => {
        const dateTransactions = groupedTransactions[dateKey];
        const date = new Date(dateKey);
        
        return (
          <motion.div 
            key={dateKey} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`mb-8 ${index > 0 ? 'border-t border-gray-200 pt-6' : ''}`}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {getDateLabel(date)}
              </h3>
            </div>
            
            <div className="space-y-3">
              {dateTransactions.map((transaction, i) => {
                return (
                  <motion.div 
                    key={transaction._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (i * 0.05) }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'income' 
                            ? 'bg-green-100' 
                            : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUp className="w-6 h-6 text-green-600" />
                          ) : (
                            <ArrowDown className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{transaction.activity}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500 capitalize">{transaction.type}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{formatTime(transaction.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <p className={`text-xs font-medium ${
                          transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Pagination Component (Dummy)
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center px-4 py-6 bg-white/50 backdrop-blur-sm border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} transaction groups
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors bg-white/70 backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let page;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 bg-white/70 backdrop-blur-sm'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors bg-white/70 backdrop-blur-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Main Component
const AllTransactions = () => {
  const { ledgerId } = useParams();
  const navigate = useNavigate();

  // State management
  const [ledger, setLedger] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Filter and pagination state
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 date groups per page

  // API calls
  const fetchLedger = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledgerId}`,
        { withCredentials: true }
      );
      console.log(response.data)
      setLedger(response.data);
    } catch (error) {
      console.error('Error fetching ledger:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}`,
        { withCredentials: true }
      );
      
      // Combine incomes and expenses into one array
      const transactions = [
        ...response.data.incomes,
        ...response.data.expenses
      ];
      
      setAllTransactions(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (data) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}`,
        data,
        { withCredentials: true }
      );
      setShowModal(false);
      fetchTransactions();
      fetchLedger();
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;

    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === activeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.activity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allTransactions, activeFilter, searchTerm]);

  // Group transactions by unique dates for pagination
  const uniqueDates = useMemo(() => {
    const dates = new Set(
      filteredTransactions.map(t => new Date(t.createdAt).toDateString())
    );
    return Array.from(dates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [filteredTransactions]);

  useEffect(() => {
    fetchLedger();
    fetchTransactions();
  }, [ledgerId]);

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [activeFilter, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!ledger) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ledger not found</h1>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const isLedgerClosed = ledger.status === 'closed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Header */}
        <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-center mb-8"
>
  <div className="flex items-center justify-center gap-4 mb-4">
    <button
      onClick={() => navigate(`/transactions/${ledgerId}`)}
      className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white/90 transition-colors text-gray-600"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Overview
    </button>
  </div>
  
  <h1 className="text-2xl font-bold text-gray-900 mb-2">All Transactions</h1>
  <p className="text-gray-600">{ledger.name}</p>
  
  {/* Status Badge */}
  <div className="flex justify-center mt-2">
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
        ledger.status === "closed"
          ? "bg-red-100 text-red-700 border border-red-200"
          : "bg-green-100 text-green-700 border border-green-200"
      }`}
    >
      {ledger.status === "closed" ? "🔒 Closed" : "✅ Active"}
    </div>
  </div>

  {/* Income & Expense */}
  <div className="grid grid-cols-2 gap-6 mt-6 max-w-md mx-auto">
    <div className="p-4 rounded-xl bg-green-50 border border-green-200">
      <p className="text-sm text-gray-500">Total Income</p>
      <p className="text-lg font-semibold text-green-700">
        ₹{ledger.totalIncome?.toLocaleString()}
      </p>
    </div>
    <div className="p-4 rounded-xl bg-red-50 border border-red-200">
      <p className="text-sm text-gray-500">Total Expense</p>
      <p className="text-lg font-semibold text-red-700">
        ₹{ledger.totalExpense?.toLocaleString()}
      </p>
    </div>
  </div>
</motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg overflow-hidden"
        >
          <TransactionFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <TransactionList 
            transactions={filteredTransactions}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={uniqueDates.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      </div>

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => !isLedgerClosed && setShowModal(true)}
        disabled={isLedgerClosed}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
          isLedgerClosed 
            ? 'bg-gray-400 cursor-not-allowed opacity-60' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
        }`}
      >
        <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
};

export default AllTransactions;