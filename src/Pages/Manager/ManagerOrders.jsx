import { useEffect, useState } from 'react';
import ManagerNavbar from '../../Components/Navbar.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineClipboardList, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';

const ManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();
  const role = 'Manager';

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/manager/fetch_orders/${statusFilter}`,
        { withCredentials: true }
      );
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const changeStatus = async (e, orderId, currentStatus) => {
    e.preventDefault();
    const newStatus =
      currentStatus === 'Pending'
        ? 'In progress'
        : currentStatus === 'In progress'
        ? 'Completed'
        : currentStatus;

    if (newStatus !== currentStatus) {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/api/manager/update_order/${orderId}/${newStatus}`,
        {},
        { withCredentials: true }
      );
      fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <ManagerNavbar role={role} page="Orders" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
            <p className="text-gray-600 text-sm mt-1">View and update order statuses</p>
          </div>

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
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {orders.length > 0 ? (
              orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
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

                    {/* Optional Dates */}
                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                      {order.startedAt && (
                        <p>
                          <span className="font-medium">Started:</span>{' '}
                          {new Date(order.startedAt).toLocaleDateString()}
                        </p>
                      )}
                      {order.completedAt && (
                        <p>
                          <span className="font-medium">Completed:</span>{' '}
                          {new Date(order.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status + Actions */}
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

                    <div className="flex gap-2">
                      {order.status === 'Pending' || order.status === 'In progress' ? (
                        <button
                          onClick={(e) => changeStatus(e, order._id, order.status)}
                          className={`text-sm px-3 py-1 rounded-md font-medium text-white transition ${
                            order.status === 'Pending'
                              ? 'bg-indigo-600 hover:bg-indigo-700'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {order.status === 'Pending' ? 'Start' : 'Complete'}
                        </button>
                      ) : null}

                      <button
                        onClick={() => navigate(`/manager/single_order/${order._id}`)}
                        className="text-sm px-3 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No orders found.</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ManagerOrders;
