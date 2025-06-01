import React from 'react'
import AdminNavbar from '../../Components/AdminNavbar.jsx'

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50">
      {/* Navbar */}
      <AdminNavbar page={"Home"} />
      {/* Hero Content */}
      <main className="max-w-4xl mx-auto text-center py-20 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
          Admin Home Page
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                This page for managing expenses of orders.
        </p>
        {/* <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            Get Started
          </button>
          <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition">
            Learn More
          </button>
        </div> */}
      </main>
    </div>
  )
}

export default AdminHome
