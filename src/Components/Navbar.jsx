import { useNavigate, Link, useLocation } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FaBook, FaChartLine, FaUser } from 'react-icons/fa';
import { useState, useEffect } from 'react';
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
      <nav className={`fixed top-2 left-2 right-2 z-50 transition-all duration-300 rounded-xl ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-xl border border-gray-200/50' 
          : 'bg-indigo-700/95 backdrop-blur-sm shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            
            {/* Logo - Responsive sizing */}
            <div 
              onClick={() => navigate('/home')}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600' 
                  : 'bg-white/20 backdrop-blur-sm border border-white/30'
              }`}>
                <FaChartLine className={`text-sm sm:text-base ${isScrolled ? 'text-white' : 'text-white'}`} />
              </div>
              
              <div>
                <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent' 
                    : 'text-white'
                }`}>
                  ProFinance
                </h1>
                <p className={`text-xs hidden sm:block -mt-0.5 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-500' : 'text-indigo-200'
                }`}>
                  Financial Ledger
                </p>
              </div>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              
              {/* Ledgers Link */}
              <Link
                to="/home"
                className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/home')
                    ? isScrolled
                      ? 'bg-indigo-100 text-indigo-700 shadow-md'
                      : 'bg-white/20 text-white shadow-md backdrop-blur-sm border border-white/30'
                    : isScrolled
                      ? 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      : 'text-indigo-100 hover:text-white hover:bg-white/10'
                } transform hover:scale-105`}
              >
                <FaBook className="text-sm" />
                <span className="text-sm lg:text-base">Ledgers</span>
                {isActive('/home') && (
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </Link>

              {/* Logout Button - Compact */}
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 lg:space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
              >
                <HiOutlineLogout className="text-sm lg:text-base" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? (
                <HiOutlineX className="text-xl" />
              ) : (
                <HiOutlineMenu className="text-xl" />
              )}
            </button>
          </div>

          {/* Mobile Menu - Collapsible */}
          <div className={`md:hidden transition-all duration-300 ease-out ${
            isMobileMenuOpen 
              ? 'max-h-48 opacity-100 pb-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className={`mt-3 p-3 rounded-lg backdrop-blur-xl border space-y-2 ${
              isScrolled 
                ? 'bg-white/90 border-gray-200/50' 
                : 'bg-white/10 border-white/20'
            }`}>
              
              {/* Mobile Ledgers Link */}
              <Link
                to="/home"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-300 ${
                  isActive('/home')
                    ? isScrolled
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-white/20 text-white'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                }`}
              >
                <FaBook className="text-sm" />
                <span className="font-medium">Ledgers</span>
                {isActive('/home') && (
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse ml-auto"></div>
                )}
              </Link>

              {/* Mobile Logout Button */}
              <button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2.5 rounded-lg font-medium transition-all duration-300 shadow-md"
              >
                <HiOutlineLogout className="text-sm" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;