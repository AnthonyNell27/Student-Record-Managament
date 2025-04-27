// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import AccountManagement from './pages/AccountManagement';
import AuditLog from './pages/AuditLog';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 Public Route */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/account-management" element={<AccountManagement />} />
          <Route path="/audit-log" element={<AuditLog />} />
        </Route>
      </Routes>
    </Router>
  );
}
