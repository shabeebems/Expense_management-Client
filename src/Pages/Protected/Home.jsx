import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import NewNavbar from '../../Components/NewNavbar.jsx';

const Home = () => {
  const [ledgers, setLedgers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  const fetchLedgers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger`,
        { withCredentials: true }
      );
      setLedgers(response.data);
    } catch (err) {
      console.error('Error fetching ledgers:', err);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  const handleSubmit = async(e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/ledger`,
        { newName },
        { withCredentials: true }
      );
      setLedgers([...ledgers, response.data]);
    } catch (error) {
      console.error('Error creating ledger:', err);
    }
    setNewName('');
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <NewNavbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Ledgers</h1>

          {/* Add New Button */}
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add New
          </button>
        </div>

        {/* Ledgers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {ledgers.length > 0 ? (
              ledgers.map((ledger) => (
                <motion.div
                  key={ledger._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between hover:shadow-xl transition"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <HiOutlineClipboardList className="text-indigo-600 text-2xl" />
                      <h2 className="text-xl font-semibold text-gray-800">
                        {ledger.name}
                      </h2>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/single_ledger/${ledger._id}`)
                        }
                        className="cursor-pointer text-sm px-3 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No Ledgers found.
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Add New Ledger</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Ledger Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
