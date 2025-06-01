import React from 'react'
import { Link } from 'react-router';

const AdminNavbar = ({ page }) => {

    const navItems = [
        { label: "Home", path: "/admin/home" },
        { label: "Orders", path: "/admin/orders" },
    ];

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-indigo-600">AdminPage</div>
                <nav className="space-x-6 text-gray-700 font-medium">
                    {navItems.map(item => (
                        <Link
                            to={item.path}
                            className={`capitalize ${
                            page?.toLowerCase() === item.label.toLowerCase()
                                ? "text-blue-600 font-semibold"
                                : "hover:text-blue-600"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}

export default AdminNavbar
