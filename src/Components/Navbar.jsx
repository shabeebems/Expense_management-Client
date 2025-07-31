import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';
import axios from 'axios';

const Navbar = ({ role, page }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isManager = role === 'Manager';

  const navItems = isManager
    ? [
        { label: 'Home', path: '/manager' },
        { label: 'Orders', path: '/manager/orders' },
      ]
    : [
        { label: 'Home', path: '/staff' },
        { label: 'Orders', path: '/staff/orders' },
      ];

  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.clear("token")
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

  return (
    <nav className="fixed top-2 left-2 right-2 z-50 bg-indigo-700 text-white rounded-xl shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          {isManager ? 'Managerpage' : 'ProFinance'}
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6 font-medium">
          {navItems.map(({ label, path }) => (
            <li key={label}>
              <Link
                to={path}
                className={`capitalize px-3 py-1.5 rounded-md transition ${
                  page?.toLowerCase() === label.toLowerCase()
                    ? 'bg-indigo-900 font-semibold'
                    : 'hover:bg-indigo-600'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={logout}
              className="flex items-center gap-2 cursor-pointer bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              <HiOutlineLogout className="text-lg" />
              Logout
            </button>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-700 px-4 py-4 rounded-b-xl space-y-2">
          {navItems.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-white transition ${
                page?.toLowerCase() === label.toLowerCase()
                  ? 'bg-indigo-900 font-semibold'
                  : 'hover:bg-indigo-600'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="mt-2 w-full flex items-center cursor-pointer justify-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition"
          >
            <HiOutlineLogout />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
