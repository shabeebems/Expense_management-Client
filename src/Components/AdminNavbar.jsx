import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminNavbar = ({ page }) => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", path: "/admin" },
    { label: "Orders", path: "/admin/orders" },
  ];

  const logout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">AdminPage</div>
        
        <nav className="space-x-6 text-gray-700 font-medium flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`capitalize ${
                page?.toLowerCase() === item.label.toLowerCase()
                  ? "text-blue-600 font-semibold"
                  : "hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <button
            onClick={logout}
            className="cursor-pointer capitalize hover:text-red-600 text-gray-700 transition font-medium"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
