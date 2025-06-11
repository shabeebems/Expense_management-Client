import { useEffect, useState } from 'react';
import AdminNavbar from '../../Components/AdminNavbar.jsx'
import axios from 'axios';
import { useNavigate } from 'react-router';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async() => {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/admin/fetch_orders/${statusFilter}`,
    { withCredentials: true });
    setOrders(response.data);
  }

  const changeStatus = async(e, orderId, status) => {
    e.preventDefault()
    console.log(status)
    await axios.patch(`${import.meta.env.VITE_SERVER_API_URL}/api/admin/update_order/${orderId}/${status}`,
    { withCredentials: true });
    fetchOrders()
  }

  useEffect(() => {
    console.log(statusFilter)
    fetchOrders()
  }, [statusFilter])

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50">
      {/* Navbar */}
      <AdminNavbar page={"Orders"} />
      
      <div className="p-6 max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <label htmlFor="statusFilter" className="text-gray-700 font-medium">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <h3 className="text-xl font-semibold mb-2">Orders List</h3>
        <div className="grid gap-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="group border border-gray-200 rounded-2xl p-6 shadow-sm transition hover:shadow-md hover:border-indigo-400 bg-white"
            >
              {/* Header: Name & Status */}
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                  {order.name}
                </h4>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    order.status === 'In progress'
                      ? 'bg-green-100 text-green-600'
                      : order.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Place */}
              <p className="text-gray-500 mb-4">Place: {order.place}</p>

              {/* Footer: Actions & Dates */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 border-t pt-4">
                {/* Dates Section */}
                <div className="text-sm text-gray-600 space-y-1">
                  {order.startedAt && (
                    <p>
                      <span className="font-medium">Started:</span>{' '}
                      {new Date(order.startedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                  {order.completedAt && (
                    <p>
                      <span className="font-medium">Completed:</span>{' '}
                      {new Date(order.completedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                {/* Buttons Section */}
                <div className="flex flex-wrap gap-3">
                  {order.status === 'Pending' && (
                    <button
                      onClick={(e) => changeStatus(e, order._id, order.status)}
                      className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Activate
                    </button>
                  )}

                  {order.status === 'In progress' && (
                    <button
                      onClick={(e) => changeStatus(e, order._id, order.status)}
                      className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Complete
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/admin/single_order/${order._id}`)}
                    className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

          ))}
          {orders.length === 0 && (
            <p className="text-gray-500">No orders yet.</p>
          )}
        </div>  
      </div>
    </div>
  )
}

export default AdminOrders
