import { useParams } from "react-router";
import AdminNavbar from "../../Components/Navbar.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AdminSingleOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenseData, setExpenseData] = useState({ 
    amount: "", 
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [incomeData, setIncomeData] = useState({ 
    amount: "", 
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchSingleOrder = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/user/fetch_single_order/${id}`, 
        { withCredentials: true }
      );
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const fetchIncomeAndExpense = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/user/fetch_income_and_expense/${id}`, 
        { withCredentials: true }
      );
      setExpenses(response.data.expenses);
      setIncomes(response.data.incomes);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  useEffect(() => {
    fetchSingleOrder();
    fetchIncomeAndExpense();
  }, []);

  const handleInputChange = (e, type) => {
    const setter = type === "expense" ? setExpenseData : setIncomeData;
    const data = type === "expense" ? expenseData : incomeData;
    setter({ 
      ...data, 
      [e.target.name]: e.target.name === 'amount' ? parseFloat(e.target.value) || 0 : e.target.value
    });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/user/add_expense/${id}`, 
        expenseData, 
        { withCredentials: true }
      );
      setExpenseData({ amount: "", description: "", date: new Date().toISOString().split('T')[0] });
      setShowExpenseModal(false);
      fetchSingleOrder();
      fetchIncomeAndExpense();
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/user/add_income/${id}`, 
        incomeData, 
        { withCredentials: true }
      );
      setIncomeData({ amount: "", description: "", date: new Date().toISOString().split('T')[0] });
      setShowIncomeModal(false);
      fetchSingleOrder();
      fetchIncomeAndExpense();
    } catch (error) {
      console.error("Error adding income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    });
  };

  const allTransactions = [
    ...incomes.map(income => ({ ...income, type: 'income' })),
    ...expenses.map(expense => ({ ...expense, type: 'expense' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredTransactions = activeTab === 'all' 
    ? allTransactions 
    : allTransactions.filter(t => t.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <AdminNavbar role="Admin" page="Orders" />
      
      <div className="max-w-7xl mx-auto p-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Order #{order.name || id} Transactions
        </motion.h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500"
          >
            <h3 className="text-lg font-medium text-gray-500">Balance</h3>
            <p className={`text-3xl font-bold ${
              (order.income - order.expense) >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              {formatCurrency(order.income - order.expense)}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500"
          >
            <h3 className="text-lg font-medium text-gray-500">Total Income</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(order.income)}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-500"
          >
            <h3 className="text-lg font-medium text-gray-500">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(order.expense)}</p>
          </motion.div>
        </div>

        {/* Transaction Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {['all', 'income', 'expense'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm cursor-pointer font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-white shadow text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowIncomeModal(true)}
              className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Add Income</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExpenseModal(true)}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Add Expense</span>
            </motion.button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  <AnimatePresence>
                    {filteredTransactions.map((transaction) => (
                      <motion.tr
                        key={transaction._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.activity || transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {transaction.type}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Income Modal */}
        <AnimatePresence>
          {showIncomeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div 
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowIncomeModal(false)}
              />
              
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Add New Income</h2>
                  <button 
                    onClick={() => setShowIncomeModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleIncomeSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="income-amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="amount"
                          id="income-amount"
                          value={incomeData.amount}
                          onChange={(e) => handleInputChange(e, "income")}
                          className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                          placeholder="0.00"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="income-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        id="income-description"
                        value={incomeData.description}
                        onChange={(e) => handleInputChange(e, "income")}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                        placeholder="Brief description"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="income-date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="income-date"
                        value={incomeData.date}
                        onChange={(e) => handleInputChange(e, "income")}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowIncomeModal(false)}
                      className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isLoading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    >
                      {isLoading ? 'Saving...' : 'Save Income'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Expense Modal */}
        <AnimatePresence>
          {showExpenseModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div 
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowExpenseModal(false)}
              />
              
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Add New Expense</h2>
                  <button 
                    onClick={() => setShowExpenseModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleExpenseSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="amount"
                          id="expense-amount"
                          value={expenseData.amount}
                          onChange={(e) => handleInputChange(e, "expense")}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                          placeholder="0.00"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        id="expense-description"
                        value={expenseData.description}
                        onChange={(e) => handleInputChange(e, "expense")}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                        placeholder="Brief description"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="expense-date"
                        value={expenseData.date}
                        onChange={(e) => handleInputChange(e, "expense")}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowExpenseModal(false)}
                      className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {isLoading ? 'Saving...' : 'Save Expense'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminSingleOrder;