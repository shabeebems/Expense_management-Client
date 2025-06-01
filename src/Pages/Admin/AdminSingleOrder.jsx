import { useParams } from "react-router";
import AdminNavbar from "../../Components/AdminNavbar.jsx";

const AdminSingleOrder = () => {
    const { id } = useParams();
    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50">
            <AdminNavbar page={"Orders"} />
            <h3 className="text-xl font-semibold mb-2">Single Order</h3>
        </div>
  )
}

export default AdminSingleOrder
