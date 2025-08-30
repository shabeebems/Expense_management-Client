import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign,
  Users, 
  Search,
  UserPlus,
  X,
  CheckCircle
} from 'lucide-react';
import AddTransactionModal from '../../Components/AddTransactionModal';
import Navbar from '../../Components/Navbar';

const Transactions = () => {
  const { ledgerId } = useParams();
  const navigate = useNavigate();

  const [ledger, setLedger] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [memberInput, setMemberInput] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [showMemberInput, setShowMemberInput] = useState(false);

  const fetchIncomeAndExpense = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}`,
        { withCredentials: true }
      );
      setExpenses(response.data.expenses || []);
      setIncomes(response.data.incomes || []);
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
      fetchIncomeAndExpense();
      fetchLedger();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const fetchLedger = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledgerId}`,
        { withCredentials: true }
      );
      setLedger(response.data);
      setMembers(response.data.members)
    } catch (error) {
      console.error('Error fetching ledger:', error);
    }
  };

  useEffect(() => {
    fetchIncomeAndExpense();
    fetchLedger();
  }, [ledgerId]);

  const handleMemberChange = async(e) => {
    const value = e.target.value.toLowerCase();
    setMemberInput(value);
    if (value.trim() === '') {
      setFilteredMembers([]);
    } else {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/users?search=${value}`,
        { withCredentials: true }
      );
      setFilteredMembers(response.data);
    }
  };

  const handleAddMember = async() => {
    if (memberInput && !members.some(m => m.username === memberInput)) {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/api/add-members`,
        { username: memberInput, ledgerId },
        { withCredentials: true }
      );
      setMembers([...members, { _id: response.data._id, username: memberInput }]);
    }
    setMemberInput('');
    setFilteredMembers([]);
    setShowMemberInput(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-slate-200 rounded-xl"></div>
              <div className="h-96 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/60 rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                Transactions
              </h1>
              {ledger && (
                <p className="text-slate-600 mt-1">{ledger.name}</p>
              )}
            </div>
          </div>

          { members.length > 1 && (
            <motion.button
              onClick={() => navigate('/messages')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200"
            >
              Message
            </motion.button>
          ) }

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </motion.button>
        </motion.div>

        {/* Ledger Summary */}
        {ledger && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 mb-8 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{ledger.name}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created: {formatDate(ledger.createdAt)}
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Updated: {formatDate(ledger.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">Total Income</p>
                </div>
                <p className="text-2xl font-bold text-emerald-700">{formatCurrency(ledger.totalIncome)}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/50 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-sm text-red-600 font-medium">Total Expense</p>
                </div>
                <p className="text-2xl font-bold text-red-700">{formatCurrency(ledger.totalExpense)}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-600 font-medium">Balance</p>
                </div>
                <p className={`text-2xl font-bold ${
                  ledger.totalIncome - ledger.totalExpense > 0 ? 'text-emerald-700' :
                  ledger.totalIncome - ledger.totalExpense < 0 ? 'text-red-700' : 'text-slate-700'
                }`}>
                  {formatCurrency(ledger.totalIncome - ledger.totalExpense)}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Add Member for Personal Ledger */}
        {members.length < 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 mb-8 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-purple-600">Invite Team Members</h2>
                  <p className="text-sm text-slate-500">Add members to collaborate on this ledger</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMemberInput(!showMemberInput)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </motion.button>
            </div>

            {/* Add Member Input */}
            <AnimatePresence>
              {showMemberInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Search className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">Search and add new member</span>
                      <button
                        onClick={() => {
                          setShowMemberInput(false);
                          setMemberInput('');
                          setFilteredMembers([]);
                        }}
                        className="ml-auto p-1 hover:bg-purple-200/50 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={memberInput}
                          onChange={handleMemberChange}
                          placeholder="Type member username..."
                          className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                          autoFocus
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddMember}
                        disabled={!memberInput.trim()}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                      >
                        Add
                      </motion.button>
                    </div>

                    {/* Search Suggestions */}
                    <AnimatePresence>
                      {memberInput && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-white border border-purple-200 rounded-lg shadow-lg overflow-hidden"
                        >
                          {filteredMembers.length > 0 ? (
                            <div className="max-h-40 overflow-y-auto">
                              {filteredMembers.map((name, i) => {
                                const isAdded = members.some(ele => ele.username === name);
                                return (
                                  <motion.div
                                    key={i}
                                    whileHover={{ backgroundColor: isAdded ? undefined : '#f8fafc' }}
                                    className={`px-4 py-3 flex items-center justify-between cursor-pointer border-b border-purple-100 last:border-b-0 ${
                                      isAdded
                                        ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                                        : "hover:bg-slate-50"
                                    }`}
                                    onClick={() => {
                                      if (!isAdded) {
                                        setMemberInput(name);
                                        setFilteredMembers([]);
                                      }
                                    }}
                                  >
                                    <span className="font-medium">{name}</span>
                                    {isAdded && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="text-sm">Added</span>
                                      </div>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-center text-slate-500">
                              <Users className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                              <p className="text-sm">No users found</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Members Section */}
        {members.length >= 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 mb-8 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-purple-600">Team Members</h2>
                  <p className="text-sm text-slate-500">{members.length} members</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMemberInput(!showMemberInput)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </motion.button>
            </div>

            {/* Add Member Input */}
            <AnimatePresence>
              {showMemberInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Search className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">Search and add new member</span>
                      <button
                        onClick={() => {
                          setShowMemberInput(false);
                          setMemberInput('');
                          setFilteredMembers([]);
                        }}
                        className="ml-auto p-1 hover:bg-purple-200/50 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={memberInput}
                          onChange={handleMemberChange}
                          placeholder="Type member username..."
                          className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                          autoFocus
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddMember}
                        disabled={!memberInput.trim()}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                      >
                        Add
                      </motion.button>
                    </div>

                    {/* Search Suggestions */}
                    <AnimatePresence>
                      {memberInput && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-white border border-purple-200 rounded-lg shadow-lg overflow-hidden"
                        >
                          {filteredMembers.length > 0 ? (
                            <div className="max-h-40 overflow-y-auto">
                              {filteredMembers.map((name, i) => {
                                const isAdded = members.some(ele => ele.username === name);
                                return (
                                  <motion.div
                                    key={i}
                                    whileHover={{ backgroundColor: isAdded ? undefined : '#f8fafc' }}
                                    className={`px-4 py-3 flex items-center justify-between cursor-pointer border-b border-purple-100 last:border-b-0 ${
                                      isAdded
                                        ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                                        : "hover:bg-slate-50"
                                    }`}
                                    onClick={() => {
                                      if (!isAdded) {
                                        setMemberInput(name);
                                        setFilteredMembers([]);
                                      }
                                    }}
                                  >
                                    <span className="font-medium">{name}</span>
                                    {isAdded && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="text-sm">Added</span>
                                      </div>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-center text-slate-500">
                              <Users className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                              <p className="text-sm">No users found</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Members List */}
            <div className="space-y-3">
              {members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {members.map((member, i) => (
                      <motion.div
                        key={member._id || i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 truncate">
                              {member.username}
                            </p>
                            <p className="text-xs text-purple-600">
                              {member.isAdmin ? "Admin" : "Member"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-slate-500"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="font-medium">No members yet</p>
                  <p className="text-sm">Add team members to collaborate on this ledger</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Income & Expenses */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Income Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-emerald-600">Income</h2>
                <p className="text-sm text-slate-500">{incomes.length} transactions</p>
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {incomes.length > 0 ? (
                  incomes.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {item.activity}
                        </p>
                        <p className="text-sm text-slate-500">{formatDate(item.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-700 font-bold">
                          +{formatCurrency(item.amount)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    variants={itemVariants}
                    className="text-center py-12 text-slate-500"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="font-medium">No income records</p>
                    <p className="text-sm">Start by adding your first income transaction</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Expense Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-600">Expenses</h2>
                <p className="text-sm text-slate-500">{expenses.length} transactions</p>
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {expenses.length > 0 ? (
                  expenses.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {item.activity}
                        </p>
                        <p className="text-sm text-slate-500">{formatDate(item.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-700 font-bold">
                          -{formatCurrency(item.amount)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    variants={itemVariants}
                    className="text-center py-12 text-slate-500"
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingDown className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="font-medium">No expense records</p>
                    <p className="text-sm">Track your expenses to better manage finances</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal Component */}
      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
};

export default Transactions;