import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineClipboardList, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();
  const role = "User";

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/user/fetch_orders/${statusFilter}`,
        { withCredentials: true }
      );
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const createOrder = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/user/create_order`,
        { name, place },
        { withCredentials: true }
      );
      setOrders([...orders, response.data]);
      setName('');
      setPlace('');
      setShowModal(false);
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !place) return alert('All fields required');
    createOrder();
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-15">
      <Navbar role={role} page="Orders" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
            <p className="text-gray-600 text-sm mt-1">All orders with status filtering</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="flex items-center gap-2">
              <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                Filter
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow-md transition duration-200 ease-in-out"
            >
              Create Order
            </button>
          </div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between hover:shadow-xl transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <HiOutlineClipboardList className="text-indigo-600 text-2xl" />
                    <h2 className="text-xl font-semibold text-gray-800">{order.name}</h2>
                  </div>
                  <div className="text-gray-600 text-sm flex items-center gap-2 mb-1">
                    <HiOutlineLocationMarker className="text-lg" />
                    {order.place}
                  </div>
                  <div className="text-gray-500 text-xs flex items-center gap-2">
                    <HiOutlineClock />
                    Created: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : order.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {order.status}
                  </span>

                  {order.status !== 'Pending' ? (
                    <button
                      onClick={() => navigate(`/user/single_order/${order._id}`)}
                      className="cursor-pointer text-indigo-600 hover:underline text-sm"
                    >
                      View
                    </button>
                  ) : (
                    <p className="text-xs text-red-500 italic">Waiting admin approval</p>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center">No orders found.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6"
            >
              <h2 className="text-xl font-semibold mb-4 text-indigo-700">New Order</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Order Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Eg. Repair AC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Eg. Malappuram"
                  />
                </div>
                <div className="flex justify-between gap-3 pt-3">
                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserOrders;
