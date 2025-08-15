import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import FinanceImage from "../assets/entrance.svg";

const EntrancePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white/80 shadow-2xl rounded-3xl px-6 sm:px-10 py-10 max-w-5xl w-full flex flex-col md:flex-row items-center gap-10 backdrop-blur-md"
      >
        {/* Left Side - Text */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 leading-snug">
            <Typewriter
              options={{
                strings: [
                  "Welcome to ExpenseFlow",
                  "Track All Your Finances in One Place",
                  "Organize. Manage. Succeed.",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h1>

          <p className="text-gray-700 text-base sm:text-lg">
            ExpenseFlow helps you keep track of incomes and expenses for different areas of life —
            whether it’s your business, household, food, or parties — all neatly organized in separate
            <span className="font-semibold"> Ledgers</span>.
          </p>

          <div className="mt-6 text-gray-700 text-sm sm:text-base space-y-3">
            <h2 className="text-xl font-bold text-green-700">About ExpenseFlow</h2>
            <p>
              Create different <span className="font-semibold">Ledgers</span> for each category like
              <span className="font-semibold"> Business, House, Food, and Party</span>. Each Ledger
              stores all your incomes and expenses for that category.
            </p>
            <h3 className="font-semibold text-green-600">What You Can Do:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Create new Ledgers for different purposes.</li>
              <li>Add income and expense records in each Ledger.</li>
              <li>Keep your finances organized and easy to track.</li>
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
            src={FinanceImage}
            alt="Expense Illustration"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 w-full">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-green-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-md hover:bg-green-700 transition duration-300 w-full sm:w-auto"
            >
              <FaSignInAlt /> Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-blue-500 text-white text-base sm:text-lg font-semibold rounded-xl shadow-md hover:bg-blue-600 transition duration-300 w-full sm:w-auto"
            >
              <FaUserPlus /> Register
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EntrancePage;
