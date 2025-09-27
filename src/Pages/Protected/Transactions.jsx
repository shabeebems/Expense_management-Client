import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, LogOut, TrendingUp, TrendingDown, DollarSign, 
  Plus, Calendar, ChevronRight, X, Info, UserPlus, 
  CheckCircle, Lock, Unlock, AlertCircle, ArrowLeft,
  ArrowRight, ArrowUp, ArrowDown, Clock, Users
} from 'lucide-react';
import AddTransactionModal from '../../Components/AddTransactionModal';
import Navbar from '../../Components/Navbar';

// Balance Card Component
const BalanceCard = ({ totalBalance, totalIncome, totalExpenses, isLedgerClosed, onStatusChange, isUpdatingStatus }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 -mt-6 mx-4 rounded-2xl shadow-lg">
      {/* Closed Ledger Notice */}
      {isLedgerClosed && (
        <div className="bg-red-500/20 border border-red-300/30 rounded-xl p-3 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-red-200" />
            <div className="flex-1">
              <p className="text-red-100 font-medium text-sm">Ledger is Closed</p>
              <p className="text-red-200 text-xs">No new transactions can be added</p>
            </div>
            <button
              onClick={() => onStatusChange('active')}
              disabled={isUpdatingStatus}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-xs font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <Unlock className="w-3 h-3" />
              {isUpdatingStatus ? 'Reopening...' : 'Reopen'}
            </button>
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <p className="text-blue-100 text-sm mb-2">Net Balance</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-1">{formatCurrency(totalBalance)}</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-300" />
            <span className="text-white text-sm font-medium">Income</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-300" />
            <span className="text-white text-sm font-medium">Expenses</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>

      {/* Status Controls */}
      <div className="mt-4 flex justify-center">
        {!isLedgerClosed ? (
          <button
            onClick={() => onStatusChange('closed')}
            disabled={isUpdatingStatus}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-300/30 text-red-100 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            {isUpdatingStatus ? 'Closing...' : 'Close Ledger'}
          </button>
        ) : null}
      </div>
    </div>
  );
};

// Ledger Info Component
const LedgerInfo = ({ ledger }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="px-4 py-4 bg-white border-b border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">{ledger.name}</h2>
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
              ledger.status === 'closed' 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {ledger.status === 'closed' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              {ledger.status === 'closed' ? 'Closed' : 'Active'}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Created on {formatDate(ledger.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Transaction List Component (Limited)
const TransactionList = ({ transactions, onSeeMore }) => {
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

  if (transactions.length === 0) {
    return (
      <div className="px-4 pb-6">
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-medium">No transactions yet</p>
          <p className="text-sm">Start by adding your first transaction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        {transactions.length >= 5 && (
          <button
            onClick={onSeeMore}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            See More
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {sortedDates.map((dateKey, index) => {
        const dateTransactions = groupedTransactions[dateKey];
        const date = new Date(dateKey);
        
        return (
          <div key={dateKey} className={`mb-8 ${index > 0 ? 'border-t border-gray-100 pt-6' : ''}`}>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {getDateLabel(date)}
              </h3>
            </div>
            
            <div className="space-y-3">
              {dateTransactions.map((transaction) => {
                return (
                  <div 
                    key={transaction._id} 
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
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
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {transactions.length >= 5 && (
        <div className="text-center pt-4">
          <button
            onClick={onSeeMore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Transactions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Team Members Component
const TeamMembers = ({ teamMembers, onAddMember, isLedgerClosed, memberInput, onMemberChange, showMemberInput, onToggleMemberInput, filteredMembers, onAddMemberSubmit }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="px-4 py-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{teamMembers.length} members</span>
          <button
            onClick={onToggleMemberInput}
            disabled={isLedgerClosed}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              isLedgerClosed
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Add Member Input */}
      {showMemberInput && !isLedgerClosed && (
        <div className="mb-6 bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700">Search and add new member</span>
            <button
              onClick={onToggleMemberInput}
              className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={memberInput}
                onChange={onMemberChange}
                placeholder="Type member username..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <button
              onClick={onAddMemberSubmit}
              disabled={!memberInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>

          {/* Search Suggestions */}
          {memberInput && filteredMembers.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div className="max-h-40 overflow-y-auto">
                {filteredMembers.map((username, i) => {
                  const isAdded = teamMembers.some(member => member.username === username);
                  return (
                    <div
                      key={i}
                      className={`px-4 py-3 flex items-center justify-between cursor-pointer border-b border-gray-100 last:border-b-0 ${
                        isAdded
                          ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if (!isAdded && onMemberChange) {
                          onMemberChange({ target: { value: username } });
                        }
                      }}
                    >
                      <span className="font-medium">{username}</span>
                      {isAdded && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Added</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
        {teamMembers.slice(0, 5).map((member) => (
          <div key={member._id} className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mx-auto mb-2 border-2 border-white shadow-sm flex items-center justify-center text-white font-semibold text-sm">
              {member.username.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs font-medium text-gray-900 truncate">{member.username}</p>
            <p className="text-xs text-gray-500">Member</p>
          </div>
        ))}
        
        {!isLedgerClosed && (
          <button
            onClick={onToggleMemberInput}
            className="text-center group"
          >
            <div className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors group-hover:scale-105 transform">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-blue-600">Add Member</p>
          </button>
        )}
      </div>

      {/* Detailed member list for larger screens */}
      <div className="hidden md:block">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">All Members</h4>
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div key={member._id} className="bg-white rounded-lg p-3 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full border border-gray-200 flex items-center justify-center text-white font-semibold text-sm">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{member.username}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>Team Member</span>
                  </div>
                </div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                Member
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component
const Transactions = () => {
  const { ledgerId } = useParams();
  const navigate = useNavigate();

  // State management
  const [ledger, setLedger] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Member management state
  const [memberInput, setMemberInput] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showMemberInput, setShowMemberInput] = useState(false);

  // API calls
  const fetchLedger = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledgerId}`,
        { withCredentials: true }
      );
      setLedger(response.data);
    } catch (error) {
      console.error('Error fetching ledger:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}/recent?limit=6`,
        { withCredentials: true }
      );
      
      setAllTransactions(response.data);
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
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledgerId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      setLedger(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating ledger status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleMemberChange = async (e) => {
    const value = e.target.value.toLowerCase();
    setMemberInput(value);
    
    if (value.trim() === '') {
      setFilteredMembers([]);
    } else {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}/api/users?search=${value}`,
          { withCredentials: true }
        );
        setFilteredMembers(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    }
  };

  const handleAddMember = async () => {
    if (memberInput && !ledger.members.some(m => m.username === memberInput)) {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_SERVER_API_URL}/api/add-members`,
          { username: memberInput, ledgerId },
          { withCredentials: true }
        );
        
        setLedger(prev => ({
          ...prev,
          members: [...prev.members, { _id: response.data._id, username: memberInput }]
        }));
      } catch (error) {
        console.error('Error adding member:', error);
      }
    }
    setMemberInput('');
    setFilteredMembers([]);
    setShowMemberInput(false);
  };

  const handleSeeMore = () => {
    navigate(`/transactions/${ledgerId}/all`);
  };

  // Calculate totals
  const totals = useMemo(() => {
    if (!ledger) return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    
    return {
      totalIncome: ledger.totalIncome,
      totalExpenses: ledger.totalExpense,
      netBalance: ledger.totalIncome - ledger.totalExpense
    };
  }, [ledger]);

  useEffect(() => {
    fetchLedger();
    fetchTransactions();
  }, [ledgerId]);

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

      <div className="bg-gradient-to-r p-4 sm:p-6 mt-16">
    </div>
      
      <BalanceCard 
        totalBalance={totals.netBalance}
        totalIncome={totals.totalIncome}
        totalExpenses={totals.totalExpenses}
        isLedgerClosed={isLedgerClosed}
        onStatusChange={handleStatusChange}
        isUpdatingStatus={isUpdatingStatus}
      />

      <div className="mt-8 relative">
        <LedgerInfo ledger={ledger} />

        <TransactionList 
          transactions={allTransactions}
          onSeeMore={handleSeeMore}
        />

        <TeamMembers 
          teamMembers={ledger.members || []}
          isLedgerClosed={isLedgerClosed}
          memberInput={memberInput}
          onMemberChange={handleMemberChange}
          showMemberInput={showMemberInput}
          onToggleMemberInput={() => setShowMemberInput(!showMemberInput)}
          filteredMembers={filteredMembers}
          onAddMemberSubmit={handleAddMember}
        />
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

export default Transactions;