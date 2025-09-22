import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatusTag from "../../Components/StatusTag";
import LoginImage from '../../assets/managerlogin.svg';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const loginCheck = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setStatus({ type: "success", message: response.data.message || "Login successful!" });
        localStorage.setItem("token", JSON.stringify(response.data.token));
        setTimeout(() => {
          navigate("/home");
        }, 1200);
      } else {
        setStatus({ type: "error", message: response.data.message || "Invalid credentials." });
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setStatus({ type: "error", message: "Login failed. Please try again." });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginCheck();
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 shadow-2xl rounded-3xl px-6 sm:px-10 py-10 max-w-5xl w-full flex flex-col md:flex-row items-center gap-10 backdrop-blur-md"
      >
        {/* Left Side - Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full md:w-1/2 flex items-center justify-center"
        >
          <img
            src={LoginImage}
            alt="Login Illustration"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          />
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center ${
            shake ? "animate-shake" : ""
          }`}
        >
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Login</h2>
          <StatusTag
            type={status.type}
            message={status.message}
            onClose={() => setStatus({ type: "", message: "" })}
          />

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="relative group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:shadow-xl transition-all duration-300"
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
                className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:shadow-xl transition-all duration-300"
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
              className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Login
            </motion.button>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-500 mt-2">
              Don’t have an account?
              <Link to="/register" className="text-green-600 hover:underline ml-1">
                Register Here
              </Link>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;