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
import UserAuth from './Wrappers/UserAuth.jsx';
import AdminAuth from './Wrappers/AdminAuth.jsx';
import Auth from './Wrappers/Auth.jsx';

function App() {
  return (
    <Routes>

      <Route path="/admin/login" element={<Auth><AdminLogin /></Auth>} />
      <Route path="/user/login" element={<Auth><UserLogin /></Auth>} />
      <Route path="/" element={<Auth><EntrancePage /></Auth>} />
      
      <Route path="/admin" element={<AdminAuth><AdminHome /></AdminAuth>} />
      <Route path="/admin/orders" element={<AdminAuth><AdminOrders /></AdminAuth>} />
      <Route path="/admin/single_order/:id" element={<AdminAuth><AdminSingleOrder /></AdminAuth>} />

      <Route path="/user" element={<UserAuth><UserHome /></UserAuth>} />
      <Route path="/user/orders" element={<UserAuth><UserOrders /></UserAuth>} />
      <Route path="/user/single_order/:id" element={<UserAuth><SingleOrder /></UserAuth>} />

    </Routes>
  )
}

export default App
