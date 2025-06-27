import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { FaUser, FaUserShield } from "react-icons/fa";
import EntranceImage from "../assets/Entrance.svg"; // Add an SVG or illustration

const EntrancePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white/80 shadow-2xl rounded-3xl px-6 sm:px-10 py-10 max-w-5xl w-full flex flex-col-reverse md:flex-row items-center gap-10 backdrop-blur-md"
      >
        {/* Left Side - Text */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-snug">
            <Typewriter
              options={{
                strings: [
                  "Welcome to BudgetFlow",
                  "Your Ultimate Project Expense Tracker",
                  "Track. Analyze. Succeed.",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h1>

          <p className="text-gray-700 text-base sm:text-lg">
            BudgetFlow helps you effortlessly manage income, expenses, and project progress — whether you're a solo creator or managing a full team.
            Monitor financial performance, analyze trends, and make data-driven decisions with ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
            <button
              onClick={() => navigate("/user/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-indigo-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300"
            >
              <FaUser /> User Portal
            </button>
            <button
              onClick={() => navigate("/admin/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-green-500 text-white text-base sm:text-lg font-semibold rounded-xl shadow-md hover:bg-green-600 transition duration-300"
            >
              <FaUserShield /> Admin Portal
            </button>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full md:w-1/2"
        >
          <img
            src={EntranceImage}
            alt="Finance Illustration"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EntrancePage;
