import { useNavigate } from "react-router-dom";

const EntrancePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center space-y-6 w-[90%] max-w-md">
        <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
        <p className="text-gray-600">Please choose your portal</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/user/login")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-lg"
          >
            User Page
          </button>

          <button
            onClick={() => navigate("/admin/login")}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-lg"
          >
            Admin Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntrancePage;
