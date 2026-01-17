import React, { useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { ref, get, update } from "firebase/database";
import { database } from "../firebase";
import { 
  CheckCircle, 
  CreditCard, 
  Shield, 
  Zap, 
  Lock, 
  ArrowRight, 
  Calendar,
  Crown,
  Gem,
  Sparkles,
  BadgeCheck,
  Clock,
  Star,
  CalendarDays,
  Trophy,
  Gift
} from 'lucide-react';

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [settings, setSettings] = useState({
    currency: "USD",
    paypalEnabled: false,
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
      icon: <Gift className="w-8 h-8" />,
      iconColor: "text-purple-500",
      features: ["Full access for 3 days", "No commitment required"],
      ...settings.plans.trial_days
    },
    {
      key: "weekly_sub",
      title: "Weekly",
      icon: <Calendar className="w-8 h-8" />,
      iconColor: "text-blue-500",
      features: ["7 days full access", "Cancel anytime"],
      ...settings.plans.weekly_sub
    },
    {
      key: "monthly_sub",
      title: "Monthly",
      icon: <CalendarDays className="w-8 h-8" />,
      iconColor: "text-orange-500",
      features: ["30 days access", "Best value deal", "Priority support"],
      popular: true,
      ...settings.plans.monthly_sub
    },
    {
      key: "yearly_sub",
      title: "Yearly",
      icon: <Trophy className="w-8 h-8" />,
      iconColor: "text-amber-500",
      features: ["365 days access", "Save 20%", "VIP support"],
      ...settings.plans.yearly_sub
    }
  ];

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Secure payment with PayPal',
      enabled: settings.paypalEnabled,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    }
  ];

  useEffect(() => {
    if (paypalButtonRef.current) {
      paypalButtonRef.current.innerHTML = '';
    }

    if (selectedMethod === 'paypal' && !window.paypal) {
      loadPayPalScript();
    }
  }, [selectedMethod]);

  const loadPayPalScript = () => {
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
            const response = await API.post('/api/payments/paypal/create-order', {
              subscriptionType: selectedPlan
            });
            const { orderID } = response.data.data;
            return orderID;
          } catch (error) {
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
            const currentExpiry = snapshot.exists() ? snapshot.val()?.subscription?.expiryDate || 0 : 0;
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
          toast.info('Payment was cancelled');
        },
        onClick: (data, actions) => {
          if (!selectedPlan) {
            toast.error('Please select a subscription plan');
            return actions.reject();
          }
          return actions.resolve();
        }
      }).render(paypalButtonRef.current);
    } catch (error) {
      console.error('Error rendering PayPal button:', error);
      toast.error('Failed to initialize PayPal button');
    }
  };

  useEffect(() => {
    if (selectedMethod === 'paypal' && window.paypal && selectedPlan) {
      renderPayPalButton();
    }
  }, [selectedPlan]);

  if (settingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">Loading payment settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Perfect Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with our flexible subscription plans. Cancel anytime.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Secure Payment</span>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BadgeCheck className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">Money Back Guarantee</span>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700">Instant Access</span>
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
                ${plan.popular ? 'ring-2 ring-orange-500/20' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-xl ${plan.iconColor.replace('text-', 'bg-')} bg-opacity-10`}>
                    {plan.icon}
                  </div>
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
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{plan.days} days access</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="p-1">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      </div>
                      <span className="text-gray-600 ml-2">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`
                    w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center
                    ${selectedPlan === plan.key
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {selectedPlan === plan.key ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Selected
                    </>
                  ) : (
                    'Select Plan'
                  )}
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
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  <Lock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
                  <p className="text-gray-500 text-sm">Choose your preferred payment method</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {paymentMethods.filter(m => m.enabled).map(method => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`
                      flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                      hover:shadow-md group
                      ${selectedMethod === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className={`
                      w-12 h-12 flex items-center justify-center rounded-lg mr-4 transition-colors
                      ${selectedMethod === method.id 
                        ? method.bgColor 
                        : 'bg-gray-50 group-hover:bg-gray-100'
                      }
                    `}>
                      <div className={selectedMethod === method.id ? method.color : 'text-gray-400'}>
                        {method.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${selectedMethod === method.id
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300 group-hover:border-gray-400'
                      }
                    `}>
                      {selectedMethod === method.id && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedMethod && selectedPlan && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Sparkles className="w-5 h-5 text-green-600" />
                    </div>
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
                      <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg mr-3">
                          <Gem className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {plans.find(p => p.key === selectedPlan)?.title} Plan
                          </h4>
                          <p className="text-sm text-gray-500">
                            {plans.find(p => p.key === selectedPlan)?.days} days access
                          </p>
                        </div>
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
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          {plans.find(p => p.key === selectedPlan)?.price === 0 
                            ? 'Free' 
                            : `${settings.currency} ${plans.find(p => p.key === selectedPlan)?.price}`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">Included</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200 mt-2">
                        <span>Total Amount</span>
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
                          <div className="p-1.5 bg-blue-100 rounded mr-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                          </div>
                          <span>Secure payment by PayPal</span>
                        </div>
                        <div ref={paypalButtonRef} className="rounded-lg overflow-hidden"></div>
                      </div>
                    </div>
                  )}

                  {!selectedMethod && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">Please select a payment method to continue</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-4">
                    <Crown className="w-8 h-8 text-orange-400" />
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
          <div className="inline-flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            <span>Your payment is secure and encrypted. We never store your credit card details.</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;