import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatusTag from '../Components/StatusTag.jsx';
import managerImage from '../assets/managerlogin.svg';
import staffImage from '../assets/stafflogin.svg';

const LoginComponent = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const loginCheck = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/auth/login_check`,
        { email, password, role },
        { withCredentials: true }
      );

      if (response.data.success) {
        setStatus({ type: 'success', message: response.data.message || 'Login successful!' });
        localStorage.setItem('token', JSON.stringify(response.data.token));
        setTimeout(() => {
          navigate(`/${role.toLowerCase()}`);
        }, 1200);
      } else {
        setStatus({ type: 'error', message: response.data.message || 'Invalid credentials.' });
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Login failed. Please try again.' });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginCheck();
  };

  const illustration = role === 'manager' ? managerImage : staffImage;
  const isManager = role === 'manager';

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div
        className={`flex flex-col ${isManager ? 'md:flex-row-reverse' : 'md:flex-row'
          } items-center md:items-stretch max-w-5xl w-full bg-white/90 rounded-3xl shadow-2xl overflow-hidden`}
      >
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-indigo-100 p-8">
          <img
            src={illustration}
            alt={`${role} Illustration`}
            className="w-3/4 md:w-4/5 lg:w-3/4 h-auto"
          />
        </div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center ${shake ? 'animate-shake' : ''}`}
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            {role.charAt(0).toUpperCase() + role.slice(1)} Login
          </h2>

          <StatusTag
            type={status.type}
            message={status.message}
            onClose={() => setStatus({ type: '', message: '' })}
          />

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="relative group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-xl transition-all duration-300"
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
                Email Address
              </label>
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-xl transition-all duration-300"
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
                Password
              </label>
            </div>

            {/* Login Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Login
            </motion.button>

            {/* Register Link (Only for Manager) */}
            {role === 'manager' && (
              <div className="text-center text-sm text-gray-500 mt-2">
                Don’t have an account?{' '}
                <Link
                  to="/manager/register"
                  className="text-indigo-600 hover:underline ml-1"
                >
                  Register Here
                </Link>
              </div>
            )}

            {/* Switch Role Link */}
            <div className="text-center text-sm text-gray-500 mt-2">
              Not a {role}?{' '}
              <Link
                to={role === 'staff' ? '/manager/login' : '/staff/login'}
                className="text-indigo-600 hover:underline ml-1"
              >
                Switch to {role === 'staff' ? 'Manager' : 'Staff'}
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginComponent;
