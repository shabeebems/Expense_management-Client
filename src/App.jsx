import { Routes, Route } from 'react-router-dom';
import './App.css'
import ManagerLogin from './Pages/Manager/ManagerLogin.jsx';
import StaffLogin from './Pages/Staff/StaffLogin.jsx';
import ManagerHome from './Pages/Manager/ManagerHome.jsx';
import StaffHome from './Pages/Staff/StaffHomes.jsx';
import StaffOrders from './Pages/Staff/StaffOrders.jsx';
import SingleOrder from './Pages/Staff/SingleOrder.jsx';
import ManagerOrders from './Pages/Manager/ManagerOrders.jsx';
import ManagerSingleOrder from './Pages/Manager/ManagerSingleOrder.jsx';
import EntrancePage from './Pages/EntrancePage.jsx';
import StaffAuth from './Wrappers/StaffAuth.jsx';
import ManagerAuth from './Wrappers/ManagerAuth.jsx';
import Auth from './Wrappers/Auth.jsx';
import { useEffect } from 'react';
import axios from 'axios';

function App() {

    useEffect(() => {
      const runServer = async() => {
        await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/staff/run-server`);
      }
      runServer()
    }, [])

  return (
    <Routes>

      <Route path="/manager/login" element={<Auth><ManagerLogin /></Auth>} />
      <Route path="/staff/login" element={<Auth><StaffLogin /></Auth>} />
      <Route path="/" element={<Auth><EntrancePage /></Auth>} />
      
      <Route path="/manager" element={<ManagerAuth><ManagerHome /></ManagerAuth>} />
      <Route path="/manager/orders" element={<ManagerAuth><ManagerOrders /></ManagerAuth>} />
      <Route path="/manager/single_order/:id" element={<ManagerAuth><ManagerSingleOrder /></ManagerAuth>} />

      <Route path="/staff" element={<StaffAuth><StaffHome /></StaffAuth>} />
      <Route path="/staff/orders" element={<StaffAuth><StaffOrders /></StaffAuth>} />
      <Route path="/staff/single_order/:id" element={<StaffAuth><SingleOrder /></StaffAuth>} />

    </Routes>
  )
}

export default App
