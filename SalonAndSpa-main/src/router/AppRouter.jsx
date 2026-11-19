import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Booking from '../pages/Booking';

// Dashboard Pages
import CustomerDashboard from '../pages/CustomerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import StylistDashboard from '../pages/StylistDashboard';
import OwnerDashboard from '../pages/OwnerDashboard';

// Shared Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div className="app-container d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<Booking />} />

            {/* Dashboards */}
            <Route path="/dashboard/customer" element={<CustomerDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/stylist" element={<StylistDashboard />} />
            <Route path="/dashboard/owner" element={<OwnerDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
