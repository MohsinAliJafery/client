import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import Payment from './components/Payment.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Layout from './components/Layout.jsx';
import PaymentSuccess from './components/PaymentSuccess.jsx';
import HomePage from './components/HomePage.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import TermsConditions from './components/TermsandCondition.jsx';
import AdminCoupons from './components/AdminCoupons.jsx';
import Pricing from './components/Pricing.jsx';
import Features from './components/Features.jsx';
import Contact from './components/Contact.jsx';
import Packages from './components/Packages.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  const role = storedUser?.role || "user";

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '8px',
          },
        }} 
      />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />   
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-condition" element={<TermsConditions />} />
        <Route path="/payment" 
          element={
            <ProtectedRoute>
              <Layout>
                <Payment />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
          path="/packages" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <Packages />
              </Layout>
            </ProtectedRoute>
          } 
        />
      <Route 
        path="/adminCoupons" 
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout>
              <AdminCoupons />
            </Layout>
          </ProtectedRoute>
        } 
      />
      </Routes>
    </div>
  );
}

export default App;