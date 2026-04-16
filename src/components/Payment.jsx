// Payment.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { 
  CheckCircle, 
  CreditCard, 
  Shield, 
  Lock, 
  Crown,
  Sparkles,
  Ticket,
  ArrowLeft,
  Wallet,
  Smartphone,
  Calendar,
  Clock,
  Users
} from 'lucide-react';
import Plans from '../components/Plans';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState('paypal'); // Default to paypal
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || '');
  const [settings, setSettings] = useState({
    currency: "USD",
    paypalEnabled: true,
    freeTrialDays: 7
  });
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [plans, setPlans] = useState([]);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Select Plan, 2: Payment
  const paypalButtonRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setSettingsLoading(true);
      const packagesRes = await API.get('/api/packages/public');
      
      if (packagesRes.data.success) {
        setPlans(packagesRes.data.data);
      } else {
        toast.error("Failed to load packages");
      }
    } catch (error) {
      console.error("API fetch error:", error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan.key);
    setAppliedCoupon(null);
    setDiscountedPrice(null);
    setCouponCode('');
    setPaymentStep(2);
  };

  const getSelectedPlanData = () => {
    return plans.find(p => p._id === selectedPlan);
  };

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Pay securely with PayPal',
      enabled: settings.paypalEnabled,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    if (!selectedPlan) {
      toast.error('Please select a plan first');
      return;
    }
    
    const selectedPlanData = getSelectedPlanData();
    const originalPrice = selectedPlanData.price;
    
    if (originalPrice === 0) {
      toast.error('Coupons cannot be applied to free plans');
      return;
    }
    
    try {
      setCouponLoading(true);
      const response = await API.post('/api/coupons/validate', {
        code: couponCode,
        planKey: selectedPlan,
        amount: originalPrice
      });
      
      const { coupon, discountAmount, finalAmount } = response.data.data;
      setAppliedCoupon(coupon);
      setDiscountedPrice({
        original: originalPrice,
        discount: discountAmount,
        final: finalAmount
      });
      
      toast.success(`Coupon applied! You saved ${coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${settings.currency}${coupon.discountValue}`}`);
      setCouponCode('');
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error.response?.data?.message || 'Invalid or expired coupon');
      setAppliedCoupon(null);
      setDiscountedPrice(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountedPrice(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  useEffect(() => {
    if (selectedMethod === 'paypal' && selectedPlan && paymentStep === 2) {
      if (!window.paypal) {
        loadPayPalScript();
      } else {
        renderPayPalButton();
      }
    }
  }, [selectedMethod, selectedPlan, paymentStep, appliedCoupon, discountedPrice]);

  const loadPayPalScript = () => {
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=${settings.currency}`;
    script.addEventListener('load', () => {
      console.log('PayPal SDK loaded successfully');
      if (selectedPlan && selectedMethod === 'paypal' && paymentStep === 2) {
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
          label: 'paypal',
          height: 45
        },
        createOrder: async (data, actions) => {
          try {
            setLoading(true);
            const requestData = {
              packageId: selectedPlan
            };
            
            if (appliedCoupon) {
              requestData.couponCode = appliedCoupon.code;
              requestData.discountedAmount = discountedPrice.final;
            }
            
            const response = await API.post('/api/payments/paypal/create-order', requestData);
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
            toast.loading('Processing payment...', { duration: 2000 });

            const captureData = { orderID: data.orderID };

            if (appliedCoupon) {
              captureData.couponCode = appliedCoupon.code;
            }

            await API.post('/api/payments/paypal/capture-order', captureData);

            const user = JSON.parse(localStorage.getItem("user"));
            const token = user.token;

            const profileRes = await API.get(
              "https://serv2.kidzet.com/api/parent/profile",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const currentExpiry = Number(
              profileRes.data?.parent?.subscription_expiry || 0
            );

            const selectedPlanData = getSelectedPlanData();
            const days = selectedPlanData.days;
            const now = Date.now();

            const baseTime = currentExpiry > now ? currentExpiry : now;
            const newExpiryDate = baseTime + days * 24 * 60 * 60 * 1000;

            await API.post(
              "https://serv2.kidzet.com/api/parent/subscription",
              {
                expiry_timestamp: newExpiryDate,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.dismiss();
            toast.success("Payment successful! Subscription activated!");

            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);

          } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error(
              error.response?.data?.message ||
              "Payment succeeded but subscription update failed"
            );
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

  const goBackToPlans = () => {
    setPaymentStep(1);
    setSelectedMethod('paypal');
  };

  if (settingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500">Loading payment options...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl shadow-lg mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-500 text-lg">
            Complete your purchase to protect your family
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            <div className={`flex-1 flex items-center ${paymentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${paymentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${paymentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex-1 flex items-center ${paymentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${paymentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 px-4">
            <span className="text-sm font-medium">Select Plan</span>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>

        {paymentStep === 1 ? (
          // Step 1: Select Plan
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Choose Your Plan</h2>
              <p className="text-gray-500 mt-2">Select the perfect plan for your family</p>
            </div>
            <Plans 
              onSelectPlan={handlePlanSelect}
              selectedPlanId={selectedPlan}
              showSelectButton={true}
              currency={settings.currency}
              columns={3}
              navigateOnSelect={true}
              className="mb-8"
            />
          </div>
        ) : (
          // Step 2: Payment
          <div className="animate-slideUp">
            {/* Back Button */}
            <button
              onClick={goBackToPlans}
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Plans</span>
            </button>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Selected Plan Summary - Left Column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                  <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Your Selection</h3>
                    <p className="text-indigo-100 text-sm">Review your plan details</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{getSelectedPlanData()?.name}</h4>
                        <p className="text-gray-500 text-sm mt-1">{getSelectedPlanData()?.description}</p>
                      </div>
                      {getSelectedPlanData()?.popular && (
                        <span className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm">{getSelectedPlanData()?.days} days access</span>
                      </div>
                      {getSelectedPlanData()?.devices > 0 && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Smartphone className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm">Up to {getSelectedPlanData()?.devices} devices</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Total</span>
                        <div className="text-right">
                          {discountedPrice ? (
                            <>
                              <span className="line-through text-gray-400 text-sm block">
                                {settings.currency} {getSelectedPlanData()?.price}
                              </span>
                              <span className="text-2xl font-bold text-indigo-600">
                                {settings.currency} {discountedPrice.final.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-indigo-600">
                              {getSelectedPlanData()?.price === 0 ? 'Free' : `${settings.currency} ${getSelectedPlanData()?.price}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section - Right Column */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-50 rounded-xl">
                        <Lock className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Secure Payment</h2>
                        <p className="text-gray-500 text-sm">Your information is encrypted and secure</p>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Method</h3>
                      <div className="space-y-3">
                        {paymentMethods.filter(m => m.enabled).map(method => (
                          <div
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`
                              flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                              ${selectedMethod === method.id
                                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                              }
                            `}
                          >
                            <div className={`
                              w-12 h-12 flex items-center justify-center rounded-xl mr-4
                              ${selectedMethod === method.id ? method.bgColor : 'bg-gray-100'}
                            `}>
                              <div className={selectedMethod === method.id ? method.color : 'text-gray-500'}>
                                {method.icon}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{method.name}</h3>
                              <p className="text-xs text-gray-500">{method.description}</p>
                            </div>
                            <div className={`
                              w-5 h-5 rounded-full border-2 flex items-center justify-center
                              ${selectedMethod === method.id
                                ? 'bg-indigo-600 border-indigo-600'
                                : 'border-gray-300'
                              }
                            `}>
                              {selectedMethod === method.id && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Coupon Section */}
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Coupon Code</h3>
                      {!appliedCoupon ? (
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            disabled={!selectedPlan || getSelectedPlanData()?.price === 0}
                          />
                          <button
                            onClick={applyCoupon}
                            disabled={couponLoading || !selectedPlan || getSelectedPlanData()?.price === 0}
                            className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {couponLoading ? 'Applying...' : 'Apply'}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Ticket className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-purple-800">{appliedCoupon.code}</span>
                                  <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                                    {appliedCoupon.discountType === 'percentage' 
                                      ? `${appliedCoupon.discountValue}% OFF` 
                                      : `${settings.currency}${appliedCoupon.discountValue} OFF`}
                                  </span>
                                </div>
                                <p className="text-xs text-purple-600 mt-0.5">Coupon applied successfully!</p>
                              </div>
                            </div>
                            <button
                              onClick={removeCoupon}
                              className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PayPal Button */}
                    {selectedMethod === 'paypal' && (
                      <div className="pt-4">
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span>PayPal protects your financial information</span>
                          </div>
                          <div ref={paypalButtonRef} className="rounded-lg overflow-hidden"></div>
                        </div>
                      </div>
                    )}

                    {/* Security Footer */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          <span>256-bit SSL Secure</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>PCI Compliant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Payment;