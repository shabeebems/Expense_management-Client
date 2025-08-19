import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  Sparkles,
  Eye,
  Plus,
  BarChart3
} from 'lucide-react';
import Navbar from '../../Components/Navbar';
import CreateLedgerModal from '../../Components/CreateLedgerModal';

const Home = () => {
  const [ledgers, setLedgers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLedgers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger`,
        { withCredentials: true }
      );
      setLedgers(response.data);
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
    setLedgers([...ledgers, response.data]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-emerald-600';
    if (balance < 0) return 'text-red-500';
    return 'text-slate-600';
  };

  const getBalanceIcon = (balance) => {
    if (balance > 0) return <TrendingUp className="w-4 h-4" />;
    if (balance < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
            <div className="h-6 bg-slate-200 rounded-lg flex-1"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="mt-6 h-9 bg-slate-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-slate-200 rounded-full text-slate-700 text-sm font-medium shadow-sm mb-4">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Financial Dashboard
          </div>
          {/* Subtitle */}
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Manage your financial records effortlessly. Track <span className="font-semibold text-blue-700">income</span>, 
            monitor <span className="font-semibold text-red-600">expenses</span>, and stay in balance.
          </p>
          
          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300"
          >
            <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </div>
            Create New Ledger
            <div className="w-2 h-2 bg-white/60 rounded-full group-hover:bg-white/80 transition-colors"></div>
          </motion.button>
        </motion.div>

        {/* Ledgers Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {ledgers.length > 0 ? (
                ledgers.map((ledger) => {
                  const balance = ledger.totalIncome - ledger.totalExpense;
                  return (
                    <motion.div
                      key={ledger._id}
                      variants={itemVariants}
                      layout
                      whileHover={{ 
                        y: -8, 
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                      className="group relative bg-white/80 backdrop-blur-xl border border-white/50 hover:border-blue-200/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Header */}
                      <div className="relative flex items-center gap-4 mb-6">
                        <motion.div 
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-300"
                        >
                          <BookOpen className="text-white text-xl" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300 truncate">
                            {ledger.name}
                          </h2>
                          <p className="text-sm text-slate-500 mt-1">Financial Record</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="relative space-y-4 mb-6">
                        <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                          <span className="text-sm font-medium text-emerald-700">Income</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(ledger.totalIncome)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                          <span className="text-sm font-medium text-red-700">Expenses</span>
                          <span className="font-bold text-red-600">{formatCurrency(ledger.totalExpense)}</span>
                        </div>
                        
                        <div className={`flex items-center justify-between p-3 rounded-xl border ${
                          balance > 0 
                            ? 'bg-emerald-50/50 border-emerald-100/50' 
                            : balance < 0 
                            ? 'bg-red-50/50 border-red-100/50' 
                            : 'bg-slate-50/50 border-slate-100/50'
                        }`}>
                          <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            Balance
                            {getBalanceIcon(balance)}
                          </span>
                          <span className={`font-bold ${getBalanceColor(balance)}`}>
                            {formatCurrency(balance)}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/transactions/${ledger._id}`)}
                        className="relative w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                      >
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        View Details
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 rounded-xl transition-opacity duration-300 -z-10"></div>
                      </motion.button>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                  variants={itemVariants}
                  className="col-span-full flex flex-col items-center justify-center py-20"
                >
                  <motion.div 
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-6 shadow-lg"
                  >
                    <BookOpen className="text-slate-400 text-4xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No ledgers yet</h3>
                  <p className="text-slate-500 text-center max-w-md">
                    Start your financial journey by creating your first ledger. Track income, expenses, and build better financial habits.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      
      {/* Modal Component */}
      <CreateLedgerModal 
        showModal={showModal}
        setShowModal={setShowModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Home;