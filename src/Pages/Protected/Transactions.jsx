import { useParams } from "react-router";
import NewNavbar from "../../Components/NewNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import AddTransactionModal from "../../Components/AddTransactionModal";

const Transactions = () => {
  const { ledgerId } = useParams();

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
      console.log(data)
      await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/transactions/${ledgerId}`,
        data,
        { withCredentials: true }
      );
      setShowModal(false);
      fetchIncomeAndExpense();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  useEffect(() => {
    fetchIncomeAndExpense();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-20">
      <NewNavbar />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Transaction
        </button>
      </div>

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
