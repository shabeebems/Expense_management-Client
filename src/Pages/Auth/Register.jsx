import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatusTag from '../../Components/StatusTag';
import Image from '../../assets/managerlogin.svg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  // New validation states
  const [errors, setErrors] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // Clear field errors when user types
  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }

    // Clear field-specific error
    setErrors(prev => ({ ...prev, [field]: '' }));
    setFormErrorMessage('');
    setSuccessMessage('');
    setStatus({ type: '', message: '' });
  };

  const registerUser = async () => {
    // Client-side password validation
    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match!' }));
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/auth/register`,
        { name, email, username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccessMessage('✅ Registration successful! Redirecting...');
        setErrors({});
        setFormErrorMessage('');
        setStatus({ type: '', message: '' });
        
        localStorage.setItem('token', JSON.stringify(response.data.token));
        setTimeout(() => {
          navigate('/home');
        }, 1200);
      } else {
        setFormErrorMessage(response.data.message || 'Registration failed.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        // Handle field-level validation errors
        if (Array.isArray(responseData?.errors)) {
          const errorMap = {};

          responseData.errors.forEach((err) => {
            errorMap[err.field] = err.message;
          });

          setErrors(errorMap);
        } else if (responseData?.message) {
          setFormErrorMessage(responseData.message);
        } else {
          setFormErrorMessage('Registration failed. Please try again.');
        }
      } else {
        setFormErrorMessage('Something went wrong. Please try again.');
      }
      
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setFormErrorMessage('')
      }, 3000);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    registerUser();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 shadow-2xl shadow-blue-500/10 rounded-3xl px-6 sm:px-10 py-10 max-w-5xl w-full flex flex-col md:flex-row items-center gap-10 backdrop-blur-xl border border-blue-200/30"
      >
        
        {/* Left Side - Illustration (Hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex md:w-1/2 items-center justify-center"
        >
          <img
            src={Image}
            alt="Register Illustration"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          />
        </motion.div>

        {/* Right Side - Form (Full width on mobile, half width on desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center ${
            shake ? "animate-shake" : ""
          }`}
        >
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Register
          </h2>

          {/* General form error message */}
          {formErrorMessage && (
            <div className="bg-red-100 text-red-800 text-sm p-3 rounded-lg mb-4">
              {formErrorMessage}
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-100 text-green-800 text-sm p-3 rounded-lg mb-4">
              {successMessage}
            </div>
          )}

          <StatusTag
            type={status.type}
            message={status.message}
            onClose={() => setStatus({ type: '', message: '' })}
          />

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name */}
            <div className="relative group">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={`peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-xl transition-all duration-300 ${
                  errors.name ? 'border-red-500' : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <label className="absolute left-4 top-2 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
                Full Name
              </label>
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className={`peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-xl transition-all duration-300 ${
                  errors.email ? 'border-red-500' : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <label className="absolute left-4 top-2 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
                Email Address
              </label>
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Username */}
            <div className="relative group">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => handleFieldChange('username', e.target.value)}
                className={`peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-xl transition-all duration-300 ${
                  errors.username ? 'border-red-500' : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <label className="absolute left-4 top-2 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
                Username
              </label>
              {errors.username && (
                <p className="text-red-600 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                className={`peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-xl transition-all duration-300 ${
                  errors.password ? 'border-red-500' : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <label className="absolute left-4 top-2 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
                Password
              </label>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                className={`peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-xl transition-all duration-300 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <label className="absolute left-4 top-2 text-slate-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
                Confirm Password
              </label>
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Register Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg shadow-blue-500/25"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </motion.button>

            {/* Login Link */}
            <div className="text-center text-sm text-slate-600 mt-2">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-indigo-600 hover:underline ml-1 font-semibold transition-colors duration-300"
              >
                Login Here
              </Link>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;