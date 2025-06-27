import Navbar from '../../Components/Navbar.jsx'

const UserHome = () => {

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar role="User" page={"Home"}/>
      {/* Main Content */}
      <main className="pt-24 px-4 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to MyApp
          </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-8">
                This page for managing expenses of orders.
            </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </main>
    </div>
  )
}

export default UserHome
