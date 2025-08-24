import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // নতুন যোগ
import Register from './pages/Register';
import Login from './pages/Login';
import Verify from './pages/Verify';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import ActivityLogs from './pages/ActivityLogs';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* হোম পেজ যোগ */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset/:token" element={<Reset />} />
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
        <Route path="/admin/users" element={<ProtectedRoute component={AdminUsers} allowedRoles={['admin']} />} />
        <Route path="/logs" element={<ProtectedRoute component={ActivityLogs} allowedRoles={['admin', 'dev', 'mod']} />} />
      </Routes>
    </Router>
  );
}

export default App;