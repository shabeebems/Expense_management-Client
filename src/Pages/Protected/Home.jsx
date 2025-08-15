import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Navbar from '../../Components/Navbar.jsx';

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
      console.error('Error creating ledger:', error);
    }
    setNewName('');
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-8">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Ledgers
            </h1>
            <p className="text-slate-600 text-sm mt-1">Manage your financial records</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <PlusCircleIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            Add New
          </button>
        </div>

        {/* Compact Ledgers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {ledgers.length > 0 ? (
              ledgers.map((ledger) => (
                <motion.div
                  key={ledger._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-blue-300 rounded-xl p-4 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                        <HiOutlineClipboardList className="text-white text-lg" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                        {ledger.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(`/single_ledger/${ledger._id}`)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      View
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="p-3 bg-slate-100 rounded-full mb-3">
                  <HiOutlineClipboardList className="text-slate-400 text-2xl" />
                </div>
                <p className="text-slate-500 text-center">No ledgers found</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compact Modal */}
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-slate-200"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Add New Ledger</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Enter ledger name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;