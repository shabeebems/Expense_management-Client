import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginComponent = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginCheck = async() => {
    const response = await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/api/auth/login_check`, {
        email, password, role
    }, { withCredentials: true });
    if(response.data.success) {
      navigate(`/${role.toLowerCase()}`);
    } else {
      alert(response.data.message)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    
    loginCheck()
    console.log('response')
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">{role} Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Login
          </button>
          <p className="text-sm text-gray-500 text-center">
            You're not {role}?
          </p>
          <Link
            to={role === "User" ? "/admin/login" : "/user/login"}
            className="text-sm text-blue-600 hover:underline text-center"
          >
            {role === "User" ? "Admin" : "User"} login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
