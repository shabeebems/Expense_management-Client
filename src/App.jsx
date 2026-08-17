import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import './App.css'
import EntrancePage from './Pages/EntrancePage.jsx';
import Auth from './Wrappers/Auth.jsx';
import { useEffect } from 'react';
import axios from 'axios';
import Login from './Pages/Auth/Login.jsx';
import Register from './Pages/Auth/Register.jsx';
import Protected from './Wrappers/Protected.jsx';
import Home from './Pages/Protected/Home.jsx';
import Ledger from './Pages/Protected/Ledger.jsx';

const LegacyLedgerRedirect = () => {
  const { ledgerId } = useParams();
  return <Navigate to={`/ledger/${ledgerId}`} replace />;
};

function App() {
  useEffect(() => {
    const runServer = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/api/run-server`);
      } catch {
        // Server wake-up is optional
      }
    };
    runServer();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Auth><EntrancePage /></Auth>} />
      <Route path="/login" element={<Auth><Login /></Auth>} />
      <Route path="/register" element={<Auth><Register /></Auth>} />

      <Route path="/home" element={<Protected><Home /></Protected>} />
      <Route path="/ledger/:ledgerId" element={<Protected><Ledger /></Protected>} />
      <Route path="/transactions/:ledgerId" element={<Protected><LegacyLedgerRedirect /></Protected>} />
      <Route path="/transactions/:ledgerId/all" element={<Protected><LegacyLedgerRedirect /></Protected>} />
    </Routes>
  );
}

export default App
