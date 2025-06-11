import { useParams } from "react-router";
import AdminNavbar from "../../Components/AdminNavbar.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminSingleOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  const [expenseData, setExpenseData] = useState({ amount: "", description: "" });
  const [incomeData, setIncomeData] = useState({ amount: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fetchSingleOrder = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/user/fetch_single_order/${id}`, { withCredentials: true });
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const fetchIncomeAndExpense = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/user/fetch_income_and_expense/${id}`, { withCredentials: true });
      setExpense(response.data.expenses);
      setIncome(response.data.incomes);
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
    setter({ ...data, [e.target.name]: e.target.value });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/api/user/add_expense/${id}`, expenseData, { withCredentials: true });
      setExpenseData({ amount: "", description: "" });
      setShowExpenseForm(false);
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
      await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/api/user/add_income/${id}`, incomeData, { withCredentials: true });
      setIncomeData({ amount: "", description: "" });
      setShowIncomeForm(false);
      fetchSingleOrder();
      fetchIncomeAndExpense();
    } catch (error) {
      console.error("Error adding income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50">
      <AdminNavbar page={"Orders"} />
      <div className="p-6 max-w-xl mx-auto">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-700">Balance</h2>
            <p className="text-2xl font-bold text-green-600">${order.income - order.expense}</p>
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

        {/* Buttons */}
        <div className="flex justify-between mb-6">
          
          {!showIncomeForm && (
            <button
              onClick={() => setShowIncomeForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              + Add Income
            </button>
          )}
          {!showExpenseForm && (
            <button
              onClick={() => setShowExpenseForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              + Add Expense
            </button>
          )}
        </div>

        {/* Expense Form */}
        {showExpenseForm && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
            <form onSubmit={handleExpenseSubmit} className="flex flex-col md:flex-row gap-2">
              <input type="number" name="amount" value={expenseData.amount} onChange={(e) => handleInputChange(e, "expense")} placeholder="Amount" required className="p-2 border rounded w-full md:w-32" />
              <input type="text" name="description" value={expenseData.description} onChange={(e) => handleInputChange(e, "expense")} placeholder="Description" required className="p-2 border rounded w-full md:w-48" />
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setShowExpenseForm(false)} className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md">Cancel</button>
                <button type="submit" disabled={isLoading} className={`px-3 py-1.5 text-white rounded-md ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}>
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Income Form */}
        {showIncomeForm && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Add New Income</h3>
            <form onSubmit={handleIncomeSubmit} className="flex flex-col md:flex-row gap-2">
              <input type="number" name="amount" value={incomeData.amount} onChange={(e) => handleInputChange(e, "income")} placeholder="Amount" required className="p-2 border rounded w-full md:w-32" />
              <input type="text" name="description" value={incomeData.description} onChange={(e) => handleInputChange(e, "income")} placeholder="Description" required className="p-2 border rounded w-full md:w-48" />
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setShowIncomeForm(false)} className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md">Cancel</button>
                <button type="submit" disabled={isLoading} className={`px-3 py-1.5 text-white rounded-md ${isLoading ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'}`}>
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* History Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4 text-green-700">Income History</h3>
            {income.length > 0 ? (
              <ul className="space-y-3">
                {income.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-200"
                  >
                    <div>
                      <span className="font-medium text-green-800 block">{item.activity}</span>
                      {item.createdAt && (
                        <span className="text-sm text-green-600">
                          {new Date(item.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                    <span className="text-green-600 font-bold">${item.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No income recorded yet.</p>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4 text-red-700">Expense History</h3>
            {expense.length > 0 ? (
              <ul className="space-y-3">
                {expense.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-red-50 p-3 rounded border border-red-200"
                  >
                    <div>
                      <span className="font-medium text-red-800 block">{item.activity}</span>
                      {item.createdAt && (
                        <span className="text-sm text-red-600">
                          {new Date(item.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
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

export default AdminSingleOrder;
