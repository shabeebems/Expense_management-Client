import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ page }) => {
  const navItems = [
    { label: "Home", path: "/user" },
    { label: "Orders", path: "/user/orders" },
  ];

  const navigate = useNavigate()

  const logout = async(e) => {
    e.preventDefault()
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API_URL}/api/auth/logout`, {},
      { withCredentials: true }
    );
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-blue-600">MyApp</div>
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          {navItems.map(({ label, path }) => (
            <li key={label}>
              <Link
                to={path}
                className={`capitalize ${
                  page?.toLowerCase() === label.toLowerCase()
                    ? "text-blue-600 font-semibold"
                    : "hover:text-blue-600"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <p onClick={logout} className='cursor-pointer'>Logout</p>
        </ul>
        <button className="md:hidden text-gray-700 focus:outline-none">☰</button>
      </div>
    </nav>
  );
};

export default Navbar;
