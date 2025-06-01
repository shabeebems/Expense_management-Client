import { useEffect, useState } from 'react';
import AdminNavbar from '../../Components/AdminNavbar.jsx'
import axios from 'axios';
import { useNavigate } from 'react-router';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate()

  const fetchOrders = async() => {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/admin/fetch_orders`,
    { withCredentials: true });
    setOrders(response.data);
  }

  const changeStatus = async(e, orderId) => {
    e.preventDefault()
    await axios.patch(`${import.meta.env.VITE_SERVER_API_URL}/api/admin/update_order/${orderId}`,
    { withCredentials: true });
    fetchOrders()
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50">
      {/* Navbar */}
      <AdminNavbar page={"Orders"} />
      <div className="p-6 max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-2">Orders List</h3>
        <div className="grid gap-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="group border border-gray-200 rounded-2xl p-6 shadow-sm transition hover:shadow-md hover:border-indigo-400 bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                  {order.name}
                </h4>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    order.status === 'Activated'
                      ? 'bg-green-100 text-green-600'
                      : order.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-gray-500 mb-4">{order.place}</p>

              <div className="flex gap-3">
                {order.status === 'Pending' && (
                  <button
                    onClick={(e) => changeStatus(e, order._id)}
                    className="cursor-pointer mt-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Activate
                  </button>
                )}

                <button
                  onClick={() => navigate(`/admin/single_order/${order._id}`)}
                  className="cursor-pointer mt-2 px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  View Details
                </button>
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
