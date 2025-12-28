// PaymentSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { ref, get, update } from "firebase/database";
import { database } from "../firebase";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const updateSubscription = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const pendingTransaction = JSON.parse(localStorage.getItem('pendingTransaction'));
        
        if (user && pendingTransaction) {
          const uid = user.uid;
          const { subscriptionType } = pendingTransaction;
          
          // Get plan days from your settings (you might need to fetch this)
          const planDays = {
            'weekly_sub': 7,
            'monthly_sub': 30,
            'yearly_sub': 365,
            'trial_days': 7
          };
          
          const days = planDays[subscriptionType] || 7;
          
          const parentRef = ref(database, `parents/${uid}`);
          const snapshot = await get(parentRef);
          
          const now = Date.now();
          const currentExpiry = snapshot.exists() 
            ? snapshot.val()?.subscription?.expiryDate || 0 
            : 0;
          
          const baseTime = currentExpiry > now ? currentExpiry : now;
          const newExpiryDate = baseTime + days * 24 * 60 * 60 * 1000;
          
          await update(parentRef, {
            subscription: { 
              expiryDate: newExpiryDate,
              plan: subscriptionType,
              updatedAt: Date.now()
            }
          });
          
          // Clear pending transaction
          localStorage.removeItem('pendingTransaction');
          
          toast.success('Subscription activated successfully!');
        }
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
    };

    updateSubscription();
    
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Your payment was processed successfully. Your subscription has been activated.
        </p>
        <p className="text-gray-500">
          Redirecting to dashboard in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;