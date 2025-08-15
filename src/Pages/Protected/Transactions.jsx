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
    <div className="p-6 bg-gray-100 min-h-screen pt-20">
      <Navbar />

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Transaction
        </button>
      </div>

      {/* Ledger Summary */}
      {ledger && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-800">{ledger.name}</h2>
            <div className="text-sm text-gray-500 space-x-4">
              <span>Created: {new Date(ledger.createdAt).toLocaleDateString()}</span>
              <span>Last updated: {new Date(ledger.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="p-3 bg-green-50 border border-green-200 rounded-md flex-1">
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-lg font-bold text-green-700">₹{ledger.totalIncome}</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex-1">
              <p className="text-sm text-gray-500">Total Expense</p>
              <p className="text-lg font-bold text-red-700">₹{ledger.totalExpense}</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex-1">
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-lg font-bold text-blue-700">
                ₹{ledger.totalIncome - ledger.totalExpense}
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Income & Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-green-600 mb-3">Income</h2>
          <ul className="space-y-2">
            {incomes.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center p-3 bg-green-50 rounded-md border border-green-200"
              >
                <span className="font-medium text-gray-700">
                  {item.activity}
                </span>
                <span className="text-green-700 font-semibold">
                  +₹{item.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expense Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-red-600 mb-3">Expenses</h2>
          <ul className="space-y-2">
            {expenses.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center p-3 bg-red-50 rounded-md border border-red-200"
              >
                <span className="font-medium text-gray-700">
                  {item.activity}
                </span>
                <span className="text-red-700 font-semibold">
                  -₹{item.amount}
                </span>
              </li>
            ))}
          </ul>
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
