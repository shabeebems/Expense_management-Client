import { motion, AnimatePresence } from "framer-motion";

const StatusTag = ({ type = "success", message, onClose }) => {
  const colors = {
    success: "bg-green-100 text-green-800 border-green-400",
    error: "bg-red-100 text-red-800 border-red-400",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`flex justify-between items-center px-4 py-2 rounded-lg border ${colors[type]} text-sm shadow-sm mb-3`}
        >
          <span>{message}</span>
          <button onClick={onClose} className="ml-4 font-bold text-lg">
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusTag;
