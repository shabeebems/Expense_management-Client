import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineLogout } from 'react-icons/hi';
import { FaBook } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

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

  return (
    <nav className="fixed top-2 left-2 right-2 z-50 bg-indigo-700 text-white rounded-xl shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div 
          onClick={() => navigate('/home')}
          className="text-2xl font-bold cursor-pointer hover:text-indigo-200 transition"
        >
          ProFinance
        </div>

        {/* Menu */}
        <ul className="hidden md:flex items-center space-x-6 font-medium">
          <li>
            <Link 
              to="/home" 
              className="flex items-center gap-2 hover:text-indigo-200 transition"
            >
              <FaBook /> Ledgers
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              <HiOutlineLogout className="text-lg" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
