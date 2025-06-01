import { useState } from 'react';
import Navbar from '../../Components/UserNavbar';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  // const [image, setImage] = useState('');
  const [showForm, setShowForm] = useState(false); // NEW: Toggle state
  const navigate = useNavigate()

  const fetchOrders = async() => {
    const response = await axios.get('http://localhost:5000/api/user/fetch_orders',
    { withCredentials: true });
    setOrders(response.data);
  }

  const createOrder = async() => {
    const response = await axios.post('http://localhost:5000/api/user/create_order', {
      name, place
    }, { withCredentials: true });
    setOrders([...orders, response.data]);
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleAddOrder = (e) => {
    e.preventDefault();

    if (!name || !place) {
      alert('Please fill all fields');
      return;
    }

    createOrder()
    // Clear form and hide it
    setName('');
    setPlace('');
    // setImage('');
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <Navbar page={"Orders"} />
      <div className="p-6 max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Orders</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showForm ? 'Cancel' : 'Create New Order'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddOrder} className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              placeholder="Order Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
            {/* <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            /> */}
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Add Order
            </button>
          </form>
        )}

        <h3 className="text-xl font-semibold mb-2">Orders List</h3>
        <div className="grid gap-4">
          {orders.map((order, index) => (
            <div onClick={() => navigate(`/user/single_order/${order._id}`)} key={index} className="border p-4 rounded shadow-sm cursor-pointer">
              <h4 className="text-lg font-bold">{order.name}</h4>
              <p className="text-gray-600">{order.place}</p>
              {/* <img
                src={order.image}
                alt={order.name}
                className="mt-2 w-full max-h-40 object-cover rounded"
              /> */}
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
