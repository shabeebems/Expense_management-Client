import { useNavigate, Link, useLocation } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FaChartLine } from 'react-icons/fa';
import { HiOutlineClipboardList, HiOutlineMail } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/98 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border-b border-blue-100/50' 
            : 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Premium Logo */}
            <motion.div 
              onClick={() => navigate('/home')}
              className="flex items-center space-x-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isScrolled 
                    ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/25' 
                    : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-xl shadow-blue-500/30'
                }`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FaChartLine className="text-white text-xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </motion.div>
              
              <div>
                <motion.h1 
                  className={`text-2xl lg:text-3xl font-bold transition-all duration-500 ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent' 
                      : 'text-white drop-shadow-lg'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  ProFinance
                </motion.h1>
                <motion.p 
                  className={`text-sm -mt-1 transition-all duration-500 ${
                    isScrolled ? 'text-slate-500' : 'text-blue-100/90'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Financial Excellence
                </motion.p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              
              {/* Home/Dashboard Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/home"
                  className={`relative flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                    isActive('/home')
                      ? isScrolled
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/20 text-white shadow-xl backdrop-blur-xl border border-white/30'
                      : isScrolled
                        ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/80'
                        : 'text-blue-100 hover:text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <div className="relative z-10 flex items-center space-x-3">
                    <HiOutlineClipboardList className="text-lg" />
                    <span>Ledgers</span>
                    {isActive('/home') && (
                      <motion.div 
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  
                  {/* Animated background for active state */}
                  {isActive('/home') && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Messages Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/messages"
                  className={`relative flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                    isActive('/messages')
                      ? isScrolled
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-white/20 text-white shadow-xl backdrop-blur-xl border border-white/30'
                      : isScrolled
                        ? 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/80'
                        : 'text-blue-100 hover:text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <div className="relative z-10 flex items-center space-x-3">
                    <HiOutlineMail className="text-lg" />
                    <span>Messages</span>
                    {isActive('/messages') && (
                      <motion.div 
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  
                  {/* Animated background for active state */}
                  {isActive('/messages') && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Premium Logout Button */}
              <motion.button
                onClick={logout}
                className={`relative flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 overflow-hidden group ${
                  isScrolled
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25'
                    : 'bg-red-500/90 hover:bg-red-600 text-white shadow-xl backdrop-blur-xl'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative z-10 flex items-center space-x-2">
                  <HiOutlineLogout className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                  <span>Logout</span>
                </div>
                
                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-3 rounded-2xl transition-all duration-300 ${
                isScrolled 
                  ? 'text-slate-700 hover:bg-slate-100 bg-white/80 shadow-lg' 
                  : 'text-white hover:bg-white/20 bg-white/10 backdrop-blur-xl border border-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiOutlineX className="text-xl" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiOutlineMenu className="text-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden"
              >
                <motion.div 
                  className={`mt-4 mb-4 p-4 rounded-2xl backdrop-blur-2xl border space-y-3 ${
                    isScrolled 
                      ? 'bg-white/98 border-slate-200/50 shadow-2xl' 
                      : 'bg-slate-800/95 border-white/20 shadow-2xl'
                  }`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  
                  {/* Mobile Dashboard Link */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/home"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                        isActive('/home')
                          ? isScrolled
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white/20 text-white shadow-xl backdrop-blur-xl'
                          : isScrolled
                            ? 'text-slate-700 hover:bg-slate-100'
                            : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <HiOutlineClipboardList className="text-lg" />
                      <span className="font-semibold">Ledgers</span>
                      {isActive('/home') && (
                        <motion.div 
                          className="w-2 h-2 bg-emerald-400 rounded-full ml-auto"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </Link>
                  </motion.div>

                  {/* Mobile Messages Link */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/messages"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                        isActive('/messages')
                          ? isScrolled
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                            : 'bg-white/20 text-white shadow-xl backdrop-blur-xl'
                          : isScrolled
                            ? 'text-slate-700 hover:bg-slate-100'
                            : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <HiOutlineMail className="text-lg" />
                      <span className="font-semibold">Messages</span>
                      {isActive('/messages') && (
                        <motion.div 
                          className="w-2 h-2 bg-emerald-400 rounded-full ml-auto"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </Link>
                  </motion.div>

                  {/* Mobile Logout Button */}
                  <motion.button
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <HiOutlineLogout className="text-lg" />
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;