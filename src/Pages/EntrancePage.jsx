import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { FaUser, FaUserShield } from "react-icons/fa";
import EntranceImage from '../assets/entrance.svg';

const EntrancePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white/80 shadow-2xl rounded-3xl px-6 sm:px-10 py-10 max-w-5xl w-full flex flex-col md:flex-row items-center gap-10 backdrop-blur-md"
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
            BudgetFlow helps Site Contractors and Project Staff easily manage incomes and expenses for their ongoing projects.
            Track financials, approve project activities, and maintain full control over project budgets.
          </p>

          {/* About Project Section */}
          <div className="mt-6 text-gray-700 text-sm sm:text-base space-y-3">
            <h2 className="text-xl font-bold text-indigo-700">About BudgetFlow</h2>
            <p>
              BudgetFlow is a project expense management system designed for <span className="font-semibold">Site Contractors</span> and their <span className="font-semibold">Site Staff</span>. Staff members can propose new projects and add expense records, while contractors oversee approvals and manage both incomes and expenses.
            </p>
            <h3 className="font-semibold text-indigo-600">User Roles:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="font-semibold">Manager (Site Contractor):</span> Approves projects, manages incomes and expenses, adds Staff members, and monitors project progress.
              </li>
              <li>
                <span className="font-semibold">Staff (Site Staff):</span> Can create project requests (approval required) and add expense entries.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Illustration + Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full md:w-1/2 flex flex-col items-center"
        >
          <img
            src={EntranceImage}
            alt="Finance Illustration"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 w-full">
            <button
              onClick={() => navigate("/staff/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-indigo-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300 w-full sm:w-auto"
            >
              <FaUser /> Staff Portal
            </button>
            <button
              onClick={() => navigate("/manager/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-green-500 text-white text-base sm:text-lg font-semibold rounded-xl shadow-md hover:bg-green-600 transition duration-300 w-full sm:w-auto"
            >
              <FaUserShield /> Manager Portal
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EntrancePage;
