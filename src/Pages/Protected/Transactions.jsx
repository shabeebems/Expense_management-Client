import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import AddTransactionModal from "../../Components/AddTransactionModal";
import Navbar from "../../Components/Navbar";

const Transactions = () => {
  const { ledgerId } = useParams();
  const navigate = useNavigate();

  const [ledger, setLedger] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchIncomeAndExpense = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}`,
        { withCredentials: true }
      );
      setExpenses(response.data.expenses || []);
      setIncomes(response.data.incomes || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
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
      console.error("Error adding transaction:", error);
    }
  };

  const fetchLedger = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger/${ledgerId}`,
        { withCredentials: true }
      );
      setLedger(response.data);
    } catch (error) {
      console.error("Error fetching ledger:", error);
    }
  };

  useEffect(() => {
    fetchIncomeAndExpense();
    fetchLedger();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Transactions
            </h1>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Transaction
          </button>
        </div>

        {/* Ledger Summary */}
        {ledger && (
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 mb-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <h2 className="text-xl font-semibold text-slate-800">{ledger.name}</h2>
              <div className="flex flex-col sm:flex-row gap-2 text-xs text-slate-500">
                <span>Created: {new Date(ledger.createdAt).toLocaleDateString()}</span>
                <span className="hidden sm:inline">•</span>
                <span>Updated: {new Date(ledger.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm text-emerald-600 font-medium mb-1">Total Income</p>
                <p className="text-2xl font-bold text-emerald-700">₹{ledger.totalIncome}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600 font-medium mb-1">Total Expense</p>
                <p className="text-2xl font-bold text-red-700">₹{ledger.totalExpense}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium mb-1">Balance</p>
                <p className="text-2xl font-bold text-blue-700">
                  ₹{ledger.totalIncome - ledger.totalExpense}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Income & Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Section */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-emerald-600">Income</h2>
              <span className="text-sm text-slate-500">({incomes.length})</span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {incomes.length > 0 ? (
                incomes.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <span className="font-medium text-slate-700 truncate pr-2">
                      {item.activity}
                    </span>
                    <span className="text-emerald-700 font-semibold whitespace-nowrap">
                      +₹{item.amount}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p>No income records</p>
                </div>
              )}
            </div>
          </div>

          {/* Expense Section */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-red-600">Expenses</h2>
              <span className="text-sm text-slate-500">({expenses.length})</span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {expenses.length > 0 ? (
                expenses.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <span className="font-medium text-slate-700 truncate pr-2">
                      {item.activity}
                    </span>
                    <span className="text-red-700 font-semibold whitespace-nowrap">
                      -₹{item.amount}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </div>
                  <p>No expense records</p>
                </div>
              )}
            </div>
          </div>
        </div>
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