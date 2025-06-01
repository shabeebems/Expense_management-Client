import { useState, useEffect } from 'react';
import Navbar from '../../Components/UserNavbar.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      console.log('Fetching')
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/user/fetch_orders`, {
        withCredentials: true
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const createOrder = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/api/user/create_order`, {
        name,
        place
      }, { withCredentials: true });

      setOrders([...orders, response.data]);
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddOrder = (e) => {
    e.preventDefault();

    if (!name || !place) {
      alert('Please fill all fields');
      return;
    }

    createOrder();
    setName('');
    setPlace('');
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 pt-24">
      <Navbar page={"Orders"} />
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Orders</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {showForm ? 'Cancel' : 'Create New Order'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddOrder} className="bg-white shadow-md p-6 rounded-lg mb-8 space-y-4">
            <input
              type="text"
              placeholder="Order Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Order
            </button>
          </form>
        )}

        <h3 className="text-xl font-semibold mb-4">Orders List</h3>
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-bold text-gray-800">{order.name}</h4>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    order.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : order.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {order.status || 'Pending'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">Place: {order.place}</p>

              {order.status !== 'Pending' ? (
                <button
                  onClick={() => navigate(`/user/single_order/${order._id}`)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  View Details
                </button>
              ) : (
                <p className="text-sm text-red-500 italic">
                  Only available if admin activates this order
                </p>
              )}
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-gray-500">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
