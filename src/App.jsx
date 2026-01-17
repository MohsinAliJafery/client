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
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-condition" element={<TermsConditions />} />
        
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
          path="/payment" 
          element={
            <ProtectedRoute>
              <Layout>
                <Payment />
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
      </Routes>
    </div>
  );
}

export default App;