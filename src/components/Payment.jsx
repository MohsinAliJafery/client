import React, { useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { ref, get, update } from "firebase/database";
import { database } from "../firebase";
import { CheckCircle, CreditCard, Shield, Zap, Lock, ArrowRight } from 'lucide-react';

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
      icon: "🆓",
      features: ["Full access", "No commitment"],
      ...settings.plans.trial_days
    },
    {
      key: "weekly_sub",
      title: "Weekly",
      icon: "📅",
      features: ["7 days access", "Cancel anytime"],
      ...settings.plans.weekly_sub
    },
    {
      key: "monthly_sub",
      title: "Monthly",
      icon: "🗓️",
      features: ["30 days access", "Best value", "Priority support"],
      popular: true,
      ...settings.plans.monthly_sub
    },
    {
      key: "yearly_sub",
      title: "Yearly",
      icon: "🏆",
      features: ["365 days access", "Save 20%", "VIP support"],
      ...settings.plans.yearly_sub
    }
  ];

    const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
      description: 'Secure payment with PayPal',
      enabled: settings.paypalEnabled
    },
    {
      id: 'paytm',
      name: 'PayTM',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Paytm_Logo_%28standalone%29.svg',
      description: 'Fast payment with PayTM',
      enabled: settings.paytmEnabled
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
        <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

 return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Perfect Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with our flexible subscription plans. Cancel anytime.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Secure Payment</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Multiple Methods</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-sm text-gray-600">Instant Access</span>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map(plan => (
            <div
              key={plan.key}
              onClick={() => setSelectedPlan(plan.key)}
              className={`
                relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300
                border-2 cursor-pointer transform hover:-translate-y-1
                ${selectedPlan === plan.key 
                  ? 'border-orange-500 ring-2 ring-orange-200' 
                  : 'border-transparent hover:border-gray-200'
                }
                ${plan.popular ? 'ring-2 ring-blue-500/20' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-3xl">{plan.icon}</div>
                  {selectedPlan === plan.key && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : `${settings.currency} ${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 ml-2">/ {plan.title.toLowerCase().replace('ly', '')}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {/* {plan.days} days access */}
                    3 days access
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`
                    w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300
                    ${selectedPlan === plan.key
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {selectedPlan === plan.key ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Payment Methods */}
            <div className="md:w-1/2 p-8 md:p-12 border-r border-gray-200">
              <div className="flex items-center mb-8">
                <Lock className="w-6 h-6 text-gray-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
              </div>

              <div className="space-y-4 mb-8">
                {paymentMethods.filter(m => m.enabled).map(method => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`
                      flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                      hover:shadow-md
                      ${selectedMethod === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg border border-gray-200 mr-4">
                      <img src={method.icon} alt={method.name} className="w-8 h-8 object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedMethod === method.id
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300'
                      }
                    `}>
                      {selectedMethod === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedMethod && selectedPlan && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Ready to proceed</h4>
                      <p className="text-sm text-gray-600">
                        You've selected <span className="font-semibold">{plans.find(p => p.key === selectedPlan)?.title}</span> plan
                        with <span className="font-semibold">{selectedMethod.toUpperCase()}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Payment Button & Summary */}
            <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100">
              {selectedPlan ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                  
                  <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {plans.find(p => p.key === selectedPlan)?.title} Plan
                        </h4>
                        <p className="text-sm text-gray-500">
                          {plans.find(p => p.key === selectedPlan)?.days} days access
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {plans.find(p => p.key === selectedPlan)?.price === 0 
                            ? 'Free' 
                            : `${settings.currency} ${plans.find(p => p.key === selectedPlan)?.price}`
                          }
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          {plans.find(p => p.key === selectedPlan)?.price === 0 
                            ? 'Free' 
                            : `${settings.currency} ${plans.find(p => p.key === selectedPlan)?.price}`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">Included</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                        <span>Total</span>
                        <span>
                          {plans.find(p => p.key === selectedPlan)?.price === 0 
                            ? 'Free' 
                            : `${settings.currency} ${plans.find(p => p.key === selectedPlan)?.price}`
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  {selectedMethod === 'paypal' && (
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Shield className="w-4 h-4 mr-2" />
                          <span>Secure payment by PayPal</span>
                        </div>
                        <div ref={paypalButtonRef} className="rounded-lg overflow-hidden"></div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'paytm' && (
                    <button
                      onClick={handlePaytmPayment}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold
                        hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                        flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Proceed with PayTM
                          <ArrowRight className="w-5 h-5 ml-3" />
                        </>
                      )}
                    </button>
                  )}

                  {!selectedMethod && (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Please select a payment method to continue</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Plan</h3>
                  <p className="text-gray-500 max-w-sm">
                    Choose a subscription plan above to proceed with payment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your payment is secure and encrypted. We never store your credit card details.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;