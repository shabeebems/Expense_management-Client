import { Routes, Route } from 'react-router-dom';
import './App.css'
import AdminLogin from './Pages/Admin/AdminLogin.jsx';
import UserLogin from './Pages/User/UserLogin.jsx';
import AdminHome from './Pages/Admin/AdminHome.jsx';
import UserHome from './Pages/User/UserHomes.jsx';
import UserOrders from './Pages/User/UserOrders.jsx';
import SingleOrder from './Pages/User/SingleOrder.jsx';
import AdminOrders from './Pages/Admin/AdminOrders.jsx';
import AdminSingleOrder from './Pages/Admin/AdminSingleOrder.jsx';
import EntrancePage from './Pages/EntrancePage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/user/login" element={<UserLogin />} />

      <Route path="/" element={<EntrancePage />} />
      
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/single_order/:id" element={<AdminSingleOrder />} />

      <Route path="/user" element={<UserHome />} />
      <Route path="/user/orders" element={<UserOrders />} />
      <Route path="/user/single_order/:id" element={<SingleOrder />} />
    </Routes>
  )
}

export default App
