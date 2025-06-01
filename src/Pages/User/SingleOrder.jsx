import { useParams } from 'react-router-dom';
import Navbar from '../../Components/UserNavbar';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SingleOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchSingleOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/fetch_single_order/${id}`,
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
        `http://localhost:5000/api/user/fetch_income_and_expense/${id}`,
        { withCredentials: true }
      );
      setExpense(response.data.expenses)
      setIncome(response.data.incomes)
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  useEffect(() => {
    fetchSingleOrder();
    fetchIncomeAndExpense();
  }, []);

  const handleInputChange = (e) => {
    setExpenseData({
      ...expenseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(
        `http://localhost:5000/api/user/add_expense/${id}`,
        expenseData,
        { withCredentials: true }
      );
      setExpenseData({ amount: '', description: '' });
      setShowForm(false);
      fetchSingleOrder(); // refresh updated data
      fetchIncomeAndExpense();
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <Navbar page="Orders" />

      <div className="max-w-4xl mx-auto px-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-700">Balance</h2>
            <p className="text-2xl font-bold text-green-600">
              ${order.income - order.expense}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-700">Income</h2>
            <p className="text-2xl font-bold text-blue-600">${order.income}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-700">Expenses</h2>
            <p className="text-2xl font-bold text-red-600">${order.expense}</p>
          </div>
        </div>

        {/* Add Expense Button (hide when form is visible) */}
        {!showForm && (
          <div className="text-right mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              + Add Expense
            </button>
          </div>
        )}

        {/* Expense Form */}
        {showForm && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
            <form
              onSubmit={handleExpenseSubmit}
              className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto"
            >
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={expenseData.amount}
                onChange={handleInputChange}
                className="p-2 border rounded w-full md:w-32 text-sm outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={expenseData.description}
                onChange={handleInputChange}
                className="p-2 border rounded w-full md:w-48 text-sm outline-none focus:border-blue-500"
                required
              />
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md text-xs w-full md:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-white rounded-md text-xs w-full md:w-auto transition ${
                    isLoading
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Income & Expense History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Income List */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4 text-green-700">Income History</h3>
            {income.length > 0 ? (
              <ul className="space-y-3">
                {income.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-200"
                  >
                    <span className="font-medium text-green-800">{item.activity}</span>
                    <span className="text-green-600 font-bold">${item.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No income recorded yet.</p>
            )}
          </div>

          {/* Expense List */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4 text-red-700">Expense History</h3>
            {expense.length > 0 ? (
              <ul className="space-y-3">
                {expense.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-red-50 p-3 rounded border border-red-200"
                  >
                    <span className="font-medium text-red-800">{item.activity}</span>
                    <span className="text-red-600 font-bold">${item.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No expenses recorded yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SingleOrder;
