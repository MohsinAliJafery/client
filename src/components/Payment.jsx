import React, { useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { 
  CheckCircle, 
  CreditCard, 
  Shield, 
  Lock, 
  Calendar,
  Crown,
  Sparkles,
  Clock,
  Star,
  Trophy,
  Ticket,
  Smartphone,
  Wifi,
  MapPin,
  Video,
  Headphones,
  Gift
} from 'lucide-react';

// Icon mapping
const iconComponents = {
  Crown: <Crown className="w-8 h-8" />,
  Trophy: <Trophy className="w-8 h-8" />,
  Calendar: <Calendar className="w-8 h-8" />,
  Star: <Star className="w-8 h-8" />,
  Gift: <Gift className="w-8 h-8" />,
  Smartphone: <Smartphone className="w-8 h-8" />,
  Wifi: <Wifi className="w-8 h-8" />,
  MapPin: <MapPin className="w-8 h-8" />,
  Video: <Video className="w-8 h-8" />,
  Headphones: <Headphones className="w-8 h-8" />
};

const getIcon = (iconName) => {
  return iconComponents[iconName] || <Crown className="w-8 h-8" />;
};

const getIconColor = (index) => {
  const colors = [
    "text-indigo-500",
    "text-indigo-600",
    "text-indigo-700",
    "text-purple-500",
    "text-blue-500",
    "text-cyan-500"
  ];
  return colors[index % colors.length];
};

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [packages, setPackages] = useState([]);
  const [settings, setSettings] = useState({
    currency: "USD",
    paypalEnabled: true,
    paytmEnabled: true,
    freeTrialDays: 7
  });
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const paypalButtonRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setSettingsLoading(true);
      
      // Fetch packages and settings in parallel
      const [packagesRes, settingsRes] = await Promise.all([
        API.get('/api/packages/public'),
        API.get('/api/admin/settings')
      ]);
      
      if (packagesRes.data.success) {
        setPackages(packagesRes.data.data);
      } else {
        toast.error("Failed to load packages");
      }
      
      if (settingsRes.data.success) {
        const data = settingsRes.data.data;
        setSettings({
          currency: data.currency || "USD",
          paypalEnabled: data.paypalEnabled ?? true,
          paytmEnabled: data.paytmEnabled ?? true,
          freeTrialDays: data.freeTrialDays || 7
        });
      }
    } catch (error) {
      console.error("API fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to load payment settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  // Build plans array from packages
  const plans = packages.map((pkg, index) => ({
    key: pkg._id,
    id: pkg._id,
    title: pkg.name,
    description: pkg.description,
    icon: getIcon(pkg.icon),
    iconColor: getIconColor(index),
    features: pkg.features || [],
    price: pkg.price,
    days: pkg.days,
    devices: pkg.devices,
    popular: pkg.popular,
    order: pkg.order
  })).sort((a, b) => a.order - b.order);

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Secure payment with PayPal',
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
    
    const selectedPlanData = plans.find(p => p.key === selectedPlan);
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
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=${settings.currency}`;
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

            console.log("Current Expiry", currentExpiry);

            const selectedPlanData = plans.find(p => p.key === selectedPlan);
            const days = selectedPlanData.days;
            const now = Date.now();

            const baseTime = currentExpiry > now ? currentExpiry : now;
            const newExpiryDate = baseTime + days * 24 * 60 * 60 * 1000;

            console.log("New Expiry", newExpiryDate);

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

            toast.success("Subscription activated successfully!");

            // setTimeout(() => {
            //   window.location.href = "/dashboard";
            // }, 2000);

          } catch (error) {
            console.error(error);
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

  useEffect(() => {
    if (selectedMethod === 'paypal' && window.paypal && selectedPlan) {
      renderPayPalButton();
    }
  }, [selectedPlan, appliedCoupon, discountedPrice]);

  if (settingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Choose Your Plan
          </h1>
          <p className="text-gray-500 text-lg">
            Flexible pricing tailored to your family's needs
          </p>
        </div>

        {/* Plans Grid - Dynamic based on packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plans.map(plan => (
            <div
              key={plan.key}
              onClick={() => {
                setSelectedPlan(plan.key);
                setAppliedCoupon(null);
                setDiscountedPrice(null);
                setCouponCode('');
              }}
              className={`
                relative bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all duration-300
                ${selectedPlan === plan.key 
                  ? 'border-indigo-600 shadow-md' 
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${plan.iconColor}/10`}>
                    {plan.icon}
                  </div>
                  {selectedPlan === plan.key && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1">{plan.title}</h3>
                {plan.description && (
                  <p className="text-xs text-gray-400 mb-3">{plan.description}</p>
                )}
                
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-800">
                      {plan.price === 0 ? 'Free' : `${settings.currency} ${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-400 text-sm ml-1">/ {plan.days} days</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-400 text-xs mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{plan.days} days access</span>
                  </div>
                  {plan.devices > 0 && (
                    <div className="flex items-center text-gray-400 text-xs mt-1">
                      <Smartphone className="w-3 h-3 mr-1" />
                      <span>Up to {plan.devices} {plan.devices === 1 ? 'device' : 'devices'}</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <CheckCircle className="w-3 h-3 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`
                    w-full py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm
                    ${selectedPlan === plan.key
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {selectedPlan === plan.key ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Crown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600">No packages available</h3>
            <p className="text-sm text-gray-400 mt-1">Please check back later</p>
          </div>
        )}

        {/* Payment Section */}
        {packages.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="md:flex">
              {/* Left Side - Payment Methods */}
              <div className="md:w-1/2 p-6 border-r border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Secure Payment</h2>
                    <p className="text-gray-400 text-sm">Choose payment method</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {paymentMethods.filter(m => m.enabled).map(method => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`
                        flex items-center p-3 rounded-lg border cursor-pointer transition-all
                        ${selectedMethod === method.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 flex items-center justify-center rounded-lg mr-3
                        ${selectedMethod === method.id ? method.bgColor : 'bg-gray-50'}
                      `}>
                        <div className={selectedMethod === method.id ? method.color : 'text-gray-400'}>
                          {method.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">{method.name}</h3>
                        <p className="text-xs text-gray-400">{method.description}</p>
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

                {selectedMethod && selectedPlan && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-start">
                      <Sparkles className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        You've selected <span className="font-semibold">{plans.find(p => p.key === selectedPlan)?.title}</span> plan
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Payment Button & Summary */}
              <div className="md:w-1/2 p-6 bg-gray-50">
                {selectedPlan ? (
                  <>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                    
                    {/* Coupon Code Section */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Coupon Code
                      </label>
                      {!appliedCoupon ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={!selectedPlan || plans.find(p => p.key === selectedPlan)?.price === 0}
                          />
                          <button
                            onClick={applyCoupon}
                            disabled={couponLoading || !selectedPlan || plans.find(p => p.key === selectedPlan)?.price === 0}
                            className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                          >
                            {couponLoading ? '...' : 'Apply'}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <Ticket className="w-3 h-3 text-purple-600 mr-1" />
                                <span className="font-semibold text-purple-800 text-sm">{appliedCoupon.code}</span>
                              </div>
                              <p className="text-xs text-purple-600 mt-0.5">
                                {appliedCoupon.discountType === 'percentage' 
                                  ? `${appliedCoupon.discountValue}% OFF` 
                                  : `${settings.currency}${appliedCoupon.discountValue} OFF`}
                              </p>
                            </div>
                            <button
                              onClick={removeCoupon}
                              className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {plans.find(p => p.key === selectedPlan)?.title} Plan
                          </h4>
                          <p className="text-xs text-gray-400">
                            {plans.find(p => p.key === selectedPlan)?.days} days access
                          </p>
                        </div>
                        <div className="text-right">
                          {discountedPrice ? (
                            <div>
                              <span className="line-through text-gray-400 text-sm mr-1">
                                {settings.currency} {plans.find(p => p.key === selectedPlan)?.price}
                              </span>
                              <span className="text-indigo-600 font-bold">
                                {settings.currency} {discountedPrice.final.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-gray-800">
                              {plans.find(p => p.key === selectedPlan)?.price === 0 
                                ? 'Free' 
                                : `${settings.currency} ${plans.find(p => p.key === selectedPlan)?.price}`}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span>{settings.currency} {plans.find(p => p.key === selectedPlan)?.price}</span>
                        </div>
                        
                        {discountedPrice && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-{settings.currency} {discountedPrice.discount.toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between pt-2 border-t border-gray-100 font-semibold">
                          <span>Total</span>
                          <span>
                            {discountedPrice ? (
                              `${settings.currency} ${discountedPrice.final.toFixed(2)}`
                            ) : (
                              plans.find(p => p.key === selectedPlan)?.price === 0 
                                ? 'Free' 
                                : `${settings.currency} ${plans.find(p => p.key === selectedPlan)?.price}`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Buttons */}
                    {selectedMethod === 'paypal' && (
                      <div>
                        <div ref={paypalButtonRef} className="rounded-lg overflow-hidden"></div>
                      </div>
                    )}

                    {!selectedMethod && (
                      <div className="text-center py-6">
                        <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Select a payment method</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <Crown className="w-10 h-10 text-indigo-300 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-1">Select a Plan</h3>
                    <p className="text-gray-400 text-sm">Choose a subscription plan above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Security Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
            <Shield className="w-3 h-3" />
            <span>Secure & encrypted payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;