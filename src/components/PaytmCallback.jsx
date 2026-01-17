// Create a new component: PaytmCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../utils/api';
import { ref, update, get } from 'firebase/database';
import { database } from '../firebase';
import toast from 'react-hot-toast';

const PaytmCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const orderId = params.get('ORDERID');
      const transactionId = params.get('TXNID');
      
      if (!orderId) {
        toast.error('Invalid payment response');
        navigate('/payment');
        return;
      }

      try {
        // Verify payment with backend
        const response = await API.post('/api/payments/paytm/verify', {
          orderId,
          transactionId
        });

        if (response.data.success) {
          // Update subscription in Firebase
          const pendingTransaction = JSON.parse(localStorage.getItem('pendingTransaction'));
          if (pendingTransaction) {
            const user = JSON.parse(localStorage.getItem("user"));
            const uid = user.uid;
            const planKey = pendingTransaction.subscriptionType;

            // Fetch plan details from settings (you need to pass these or fetch again)
            const settingsSnapshot = await get(ref(database, "app_settings"));
            const settings = settingsSnapshot.val();
            const days = settings.plans[planKey].days;

            const parentRef = ref(database, `parents/${uid}`);
            const snapshot = await get(parentRef);

            const now = Date.now();
            const currentExpiry = snapshot.exists() ? snapshot.val()?.subscription?.expiryDate || 0 : 0;
            const baseTime = currentExpiry > now ? currentExpiry : now;
            const newExpiryDate = baseTime + days * 24 * 60 * 60 * 1000;

            await update(parentRef, {
              subscription: { expiryDate: newExpiryDate }
            });

            localStorage.removeItem('pendingTransaction');
            toast.success('Payment successful! Subscription activated.');
            navigate('/dashboard');
          }
        } else {
          toast.error('Payment verification failed');
          navigate('/payment');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Payment verification failed');
        navigate('/payment');
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verifying your payment...</p>
      </div>
    </div>
  );
};

export default PaytmCallback;