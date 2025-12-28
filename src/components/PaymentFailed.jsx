// PaymentFailed.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any pending transaction data
    localStorage.removeItem('pendingTransaction');
  }, []);

  const handleRetry = () => {
    navigate('/payment');
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600">
            We couldn't process your payment. Please try again or contact support.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <RefreshCw size={20} />
            Try Again
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Go to Dashboard
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Need help?</p>
          <a 
            href="mailto:support@example.com" 
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;