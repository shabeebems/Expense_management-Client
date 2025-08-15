import { Routes, Route } from 'react-router-dom';
import './App.css'
import EntrancePage from './Pages/EntrancePage.jsx';
import Auth from './Wrappers/Auth.jsx';
import { useEffect } from 'react';
import axios from 'axios';
import Login from './Pages/Auth/Login.jsx';
import Register from './Pages/Auth/Register.jsx';
import Protected from './Wrappers/Protected.jsx';
import Home from './Pages/Protected/Home.jsx';
import Transactions from './Pages/Protected/Transactions.jsx';

function App() {

    useEffect(() => {
      const runServer = async() => {
        await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/run-server`);
      }
      runServer()
    }, [])

  return (
    <Routes>

      <Route path="/" element={<Auth><EntrancePage /></Auth>} />
      <Route path="/login" element={<Auth><Login /></Auth>} />
      <Route path="/register" element={<Auth><Register /></Auth>} />
      
      <Route path="/home" element={<Protected><Home /></Protected>} />
      <Route path="/single_ledger/:ledgerId" element={<Protected><Transactions /></Protected>} />

    </Routes>
  )
}

export default App
