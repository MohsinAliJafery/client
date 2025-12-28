import React, { useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { ref, get, update } from "firebase/database";
import { database } from "../firebase";

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [settings, setSettings] = useState({
  currency: "USD",
  paypalEnabled: false,
  paytmEnabled: false,
  plans: {
    trial_days: { days: 0, price: 0 },
    weekly_sub: { days: 0, price: 0 },
    monthly_sub: { days: 0, price: 0 },
    yearly_sub: { days: 0, price: 0 }
  }
});
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const paypalButtonRef = useRef(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
  try {
    setSettingsLoading(true);

    const snapshot = await get(ref(database, "app_settings"));

    if (!snapshot.exists()) {
      toast.error("App settings not found");
      return;
    }

    const data = snapshot.val();

    setSettings({
      currency: data.currency || "USD",
      paypalEnabled: data.paypalEnabled ?? true,
      paytmEnabled: data.paytmEnabled ?? true,
      plans: {
        trial_days: data.plans?.trial_days ?? { days: 0, price: 0 },
        weekly_sub: data.plans?.weekly_sub ?? { days: 0, price: 0 },
        monthly_sub: data.plans?.monthly_sub ?? { days: 0, price: 0 },
        yearly_sub: data.plans?.yearly_sub ?? { days: 0, price: 0 }
      }
    });

  } catch (error) {
    console.error("Firebase fetch error:", error);
    toast.error("Failed to load payment settings");
  } finally {
    setSettingsLoading(false);
  }
};

const plans = [
  {
    key: "trial_days",
    title: "Free Trial",
    ...settings.plans.trial_days
  },
  {
    key: "weekly_sub",
    title: "Weekly",
    ...settings.plans.weekly_sub
  },
  {
    key: "monthly_sub",
    title: "Monthly",
    ...settings.plans.monthly_sub
  },
  {
    key: "yearly_sub",
    title: "Yearly",
    ...settings.plans.yearly_sub
  }
];


  useEffect(() => {
    // Clear previous PayPal buttons when method changes
    if (paypalButtonRef.current) {
      paypalButtonRef.current.innerHTML = '';
    }

    // Load PayPal script dynamically
    if (selectedMethod === 'paypal' && !window.paypal) {
      loadPayPalScript();
    }
  }, [selectedMethod]);

  const loadPayPalScript = () => {
    // Remove existing PayPal script if any
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
    script.addEventListener('load', () => {
      console.log('PayPal SDK loaded successfully');
      if (selectedPlan && selectedMethod === 'paypal') {
        renderPayPalButton();
      }
    });
    script.addEventListener('error', () => {
      console.error('Failed to load PayPal SDK');
      toast.error('Failed to load PayPal. Please try again.');
    });
    document.body.appendChild(script);
  };

  const renderPayPalButton = () => {
    if (!window.paypal || !paypalButtonRef.current || !selectedPlan) {
      console.log('Cannot render PayPal button:', {
        hasPayPal: !!window.paypal,
        hasRef: !!paypalButtonRef.current,
        hasPlan: !!selectedPlan
      });
      return;
    }

    paypalButtonRef.current.innerHTML = '';

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        },

        createOrder: async (data, actions) => {
          try {
            setLoading(true);
            console.log('Creating PayPal order for plan:', selectedPlan);
            
            const response = await API.post('/api/payments/paypal/create-order', {
              subscriptionType: selectedPlan
            });
            
            const { orderID } = response.data.data;
            console.log('PayPal order created successfully:', orderID);
            return orderID;
          } catch (error) {
            console.error('Error creating PayPal order:', error);
            const errorMsg = error.response?.data?.message || 'Failed to create PayPal order';
            toast.error(errorMsg);
            throw new Error(errorMsg);
          } finally {
            setLoading(false);
          }
        },
        
        onApprove: async (data, actions) => {
  try {
    setLoading(true);

    await API.post('/api/payments/paypal/capture-order', {
      orderID: data.orderID
    });

    const user = JSON.parse(localStorage.getItem("user"));
    const uid = user.uid;

    const days = settings.plans[selectedPlan].days;

    const parentRef = ref(database, `parents/${uid}`);
    const snapshot = await get(parentRef);

    const now = Date.now();
    const currentExpiry =
      snapshot.exists()
        ? snapshot.val()?.subscription?.expiryDate || 0
        : 0;

    const baseTime = currentExpiry > now ? currentExpiry : now;
    const newExpiryDate = baseTime + days * 24 * 60 * 60 * 1000;

    await update(parentRef, {
      subscription: { expiryDate: newExpiryDate }
    });

    toast.success("Subscription activated successfully!");

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);

  } catch (error) {
    console.error(error);
    toast.error("Payment succeeded but subscription update failed");
  } finally {
    setLoading(false);
  }
},
        
        onError: (err) => {
          console.error('PayPal button error:', err);
          toast.error('Payment failed. Please try again.');
        },
        
        onCancel: (data) => {
          console.log('PayPal payment cancelled by user:', data);
          toast.info('Payment was cancelled');
        },
        
        onClick: (data, actions) => {
          console.log('PayPal button clicked');
          // Validate before proceeding
          if (!selectedPlan) {
            toast.error('Please select a subscription plan');
            return actions.reject();
          }
          return actions.resolve();
        }
      }).render(paypalButtonRef.current);
      
      console.log('PayPal button rendered successfully');
    } catch (error) {
      console.error('Error rendering PayPal button:', error);
      toast.error('Failed to initialize PayPal button');
    }
  };

  const handlePaytmPayment = async () => {
  if (!selectedPlan) {
    toast.error('Please select a subscription plan');
    return;
  }

  setLoading(true);

  try {
    // Get user info
    const user = JSON.parse(localStorage.getItem("user")) || {};
    
    const response = await API.post('/api/payments/paytm/initiate', {
      subscriptionType: selectedPlan,
      user: {
        uid: user.uid || `user_${Date.now()}`,
        email: user.email || 'customer@example.com',
        name: user.name || 'Customer'
      }
    });

    const { data } = response.data;
    
    console.log('PayTM Response:', data);
    
    // Validate response
    if (!data.paytmParams || !data.checksum) {
      throw new Error('Invalid PayTM response');
    }

    // Create form and submit to PayTM
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://securegw-stage.paytm.in/order/process'; // Staging URL
    
    // Important: Set proper encoding
    form.setAttribute('accept-charset', 'UTF-8');
    
    // Add all required parameters
    const params = {
      MID: data.paytmParams.MID,
      ORDER_ID: data.paytmParams.ORDER_ID,
      CUST_ID: data.paytmParams.CUST_ID,
      INDUSTRY_TYPE_ID: data.paytmParams.INDUSTRY_TYPE_ID,
      CHANNEL_ID: data.paytmParams.CHANNEL_ID,
      TXN_AMOUNT: data.paytmParams.TXN_AMOUNT,
      WEBSITE: data.paytmParams.WEBSITE,
      CALLBACK_URL: data.paytmParams.CALLBACK_URL,
      EMAIL: data.paytmParams.EMAIL,
      MOBILE_NO: data.paytmParams.MOBILE_NO,
      // Optional but recommended
      CHECKSUMHASH: data.checksum
    };
    
    // Add parameters to form
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    });
    
    // Create a hidden div to show the form briefly
    const formContainer = document.createElement('div');
    formContainer.style.position = 'fixed';
    formContainer.style.top = '0';
    formContainer.style.left = '0';
    formContainer.style.width = '100%';
    formContainer.style.height = '100%';
    formContainer.style.backgroundColor = 'white';
    formContainer.style.display = 'flex';
    formContainer.style.flexDirection = 'column';
    formContainer.style.alignItems = 'center';
    formContainer.style.justifyContent = 'center';
    formContainer.style.zIndex = '9999';
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Redirecting to PayTM...';
    loadingText.style.fontSize = '18px';
    loadingText.style.marginBottom = '20px';
    loadingText.style.color = '#333';
    
    const spinner = document.createElement('div');
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.border = '4px solid #f3f3f3';
    spinner.style.borderTop = '4px solid #f97316';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    
    // Add CSS for spinner
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    formContainer.appendChild(loadingText);
    formContainer.appendChild(spinner);
    formContainer.appendChild(form);
    document.body.appendChild(formContainer);
    
    // Store transaction info
    localStorage.setItem('pendingTransaction', JSON.stringify({
      orderId: data.orderId,
      subscriptionType: selectedPlan,
      timestamp: Date.now()
    }));
    
    // Submit form after a brief delay
    setTimeout(() => {
      form.submit();
    }, 1000);
    
  } catch (error) {
    console.error('PayTM payment error:', error);
    
    // Remove any existing form container
    const existingContainer = document.querySelector('div[style*="position: fixed"]');
    if (existingContainer) {
      existingContainer.remove();
    }
    
    let errorMessage = 'Failed to initiate PayTM payment';
    
    if (error.response) {
      console.error('Response error:', error.response.data);
      errorMessage = error.response.data?.message || errorMessage;
      
      // Check for specific errors
      if (error.response.status === 400) {
        if (error.response.data?.message?.includes('checksum')) {
          errorMessage = 'Payment gateway error. Please contact support.';
        }
      }
    }
    
    toast.error(errorMessage);
    
    // Optionally redirect to payment failed page
    setTimeout(() => {
      window.location.href = '/payment/failed';
    }, 2000);
    
  } finally {
    setLoading(false);
  }
};

  // Re-render PayPal button when plan is selected
  useEffect(() => {
    if (selectedMethod === 'paypal' && window.paypal && selectedPlan) {
      console.log('Re-rendering PayPal button for plan:', selectedPlan);
      renderPayPalButton();
    }
  }, [selectedPlan]);

 if (settingsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading payment options...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-orange-500">
        Choose Your Plan
      </h1>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
  {plans.map(plan => (
    <div
      key={plan.key}
      onClick={() => setSelectedPlan(plan.key)}
      className={`cursor-pointer border-2 rounded-lg p-6 text-center transition
        ${selectedPlan === plan.key
          ? "border-orange-500 shadow-lg"
          : "border-gray-300"
        }`}
    >
      <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>

      <p className="text-gray-600 mb-4">
        {plan.days} days access
      </p>

      <p className="text-2xl font-bold text-black">
        {plan.price === 0
          ? "Free"
          : `${settings.currency} ${plan.price}`
        }
      </p>
    </div>
  ))}
</div>


      {/* Payment Methods */}
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
        Select Payment Method
      </h2>
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {settings.paypalEnabled && (
          <div
            onClick={() => setSelectedMethod('paypal')}
            className={`cursor-pointer border-2 rounded-lg p-6 w-48 text-center hover:shadow-lg transition 
              ${selectedMethod === 'paypal' ? 'border-orange-500 shadow-lg' : 'border-gray-300'}`}
          >
            <h3 className="text-lg font-semibold mb-2">PayPal</h3>
            <p className="text-gray-600">Pay with your PayPal account</p>
          </div>
        )}
        {settings.paytmEnabled && (
          <div
            onClick={() => setSelectedMethod('paytm')}
            className={`cursor-pointer border-2 rounded-lg p-6 w-48 text-center hover:shadow-lg transition 
              ${selectedMethod === 'paytm' ? 'border-orange-500 shadow-lg' : 'border-gray-300'}`}
          >
            <h3 className="text-lg font-semibold mb-2">PayTM</h3>
            <p className="text-gray-600">Pay with PayTM</p>
          </div>
        )}
      </div>

      {/* Payment Actions */}
      <div className="flex justify-center">
        {selectedMethod === 'paypal' && (
          <div className="w-full md:w-1/2">
            {!selectedPlan ? (
              <p className="text-center text-red-500 mb-4">
                Please select a subscription plan to continue with PayPal
              </p>
            ) : (
              <div ref={paypalButtonRef}></div>
            )}
            {loading && <p className="text-center mt-2">Processing PayPal payment...</p>}
          </div>
        )}

        {selectedMethod === 'paytm' && (
          <div>
            {!selectedPlan ? (
              <p className="text-center text-red-500 mb-4">
                Please select a subscription plan to continue with PayTM
              </p>
            ) : (
              <button
                onClick={handlePaytmPayment}
                disabled={loading}
                className="px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                {loading ? 'Processing...' : 'Proceed to PayTM'}
              </button>
            )}
          </div>
        )}

        {selectedMethod && !selectedPlan && (
          <p className="text-center text-red-500 mt-4">
            Please select a subscription plan to continue with {selectedMethod.toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
};

export default Payment;